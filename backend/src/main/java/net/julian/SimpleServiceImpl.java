package net.julian;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.jaxrs.whiteboard.propertytypes.JSONRequired;
import org.osgi.service.jaxrs.whiteboard.propertytypes.JaxrsResource;
import org.slf4j.Logger;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@JaxrsResource
@Produces(MediaType.APPLICATION_JSON)
@JSONRequired
@Component(immediate = true, service = SimpleServiceImpl.class)
@Path("/employees")
public class SimpleServiceImpl {

    private static final Logger logger = org.slf4j.LoggerFactory.getLogger(SimpleServiceImpl.class);
    private List<Employee> employees;


    @Activate
    public void activate() {
        logger.info("Server was activated...");
        this.employees = IntStream.range(0, 100)
            .mapToObj(i -> new Employee(i, "Julian" + i, (int) (Math.random() * i * 1000), 33))
            .collect(Collectors.toList());
    }

    @GET
    public Response getAll() {
        try {
            Thread.sleep((int) (Math.random() * 5_000));
        } catch (InterruptedException e) {
            // Intentionally do nothing
        }
        return Response
            .status(Response.Status.OK)
            .header("Access-Control-Allow-Origin", "*")
            .entity(employees)
            .build();
    }

    @GET
    @Path("{id}")
    public Response getEmployee(@PathParam("id") int i) {
        try {
            return Response
                .status(Response.Status.OK)
                .header("Access-Control-Allow-Origin", "*")
                .entity(employees.get(i))
                .build();
        } catch (IndexOutOfBoundsException e) {
            return Response.
                status(Response.Status.NOT_FOUND)
                .build();
        }
    }

//    @POST
//    public void sayHi(Employee e) {
//        logger.info("Employee is {}", e);
//    }

}

