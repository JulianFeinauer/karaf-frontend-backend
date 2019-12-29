# How to build an Angular Frontend with a CXF based Backend for Apache Karaf
> Julian Feinauer

Apache Karaf is a complete applications container, supporting several programming models: OSGi, DS, Blueprint, Spring, ....
But, especially with the evolvement of the OSGi Specification and technologies like Declarative Services (DS) one can easily start new projects based on "pure" OSGi Technology and not rely on external frameworks.
Furthermore, Karaf can easily serve "static" resources like Apache Tomcat or Jetty which makes it easy to deploy a (Javascript based) Frontend.
As Angular is still one of the big Frontend frameworks this example shows how to setup an Angular Frontend together with a suitable Backend and how to deploy it in Apache Karaf as one Feature.
This example is more targeted towards Java users so the Angular part is pretty short, but there are tons of resources for that (espeically this blog post here, which already describes most of the Frontend Part: http://blog.nanthrax.net/?p=827). The example is based on the Angular CLI (https://github.com/angular/angular-cli) which can also be integrated easily into a maven build (remember, backend Java dev here...).
Our Setup consists of 3 Modules, a parent module and one child for the frontend and one for the backend, so the folder structure is
```
parent/
  +--- pom.xml
  +--- src/main/feature/feature.xml
  +--- frontend/
  |       +-- pom.xml
  |       +-- package.json
  |       +-- ... further angular files...
  |
  +--- backend/
          +-- pom.xml
          +-- src/main/java
```

Before starting with front or backend, we add a root `pom.xml`in the partent folder which looks like that
```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

  <modelVersion>4.0.0</modelVersion>

  <groupId>net.julian</groupId>
  <artifactId>angular-example</artifactId>
  <version>1.0.0-SNAPSHOT</version>

  <packaging>pom</packaging>

  <properties>
    <deploy.url>my-angular-app</deploy.url>
    <karaf.version>4.2.5</karaf.version>
    <karaf-feature-name>karaf-feature</karaf-feature-name>
  </properties>

  <modules>
    <module>frontend</module>
    <module>backend</module>
  </modules>

  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.karaf.tooling</groupId>
        <artifactId>karaf-maven-plugin</artifactId>
        <version>${karaf.version}</version>
        <extensions>true</extensions>
        <configuration>
          <startLevel>80</startLevel>
          <includeTransitiveDependency>true</includeTransitiveDependency>
          <aggregateFeatures>false</aggregateFeatures>
          <includeProjectArtifact>false</includeProjectArtifact>
          <primaryFeatureName>angular-example</primaryFeatureName>
        </configuration>
        <executions>
          <execution>
            <id>generate-features-file</id>
            <phase>package</phase>
            <goals>
              <goal>features-generate-descriptor</goal>
            </goals>
          </execution>
        </executions>
      </plugin>
    </plugins>
  </build>
</project>
```
The pom contains the two entries for the two submodules and also bulilds a karaf feature which is handy to deploy all parts of the application once to Apache Karaf.

Now, to the Frontend first. Similar to the linked tutorial our angular frontend has to be initialised using `ng`, this is done calling
```
ng new frontend
```
in the `parent` folder, then the `frontend` subfolder is automatically created. Furthermore, the Angular CLI (ng) creates all required resources.
The output could looke something like
```bash
? Would you like to add Angular routing? Yes
? Which stylesheet format would you like to use? CSS
CREATE frontend/README.md (1026 bytes)
CREATE frontend/.editorconfig (246 bytes)
CREATE frontend/.gitignore (631 bytes)
CREATE frontend/angular.json (3609 bytes)
CREATE frontend/package.json (1294 bytes)
CREATE frontend/tsconfig.json (543 bytes)
CREATE frontend/tslint.json (1953 bytes)
CREATE frontend/browserslist (429 bytes)
CREATE frontend/karma.conf.js (1020 bytes)
CREATE frontend/tsconfig.app.json (270 bytes)
CREATE frontend/tsconfig.spec.json (270 bytes)
CREATE frontend/src/favicon.ico (948 bytes)
CREATE frontend/src/index.html (294 bytes)
CREATE frontend/src/main.ts (372 bytes)
CREATE frontend/src/polyfills.ts (2838 bytes)
CREATE frontend/src/styles.css (80 bytes)
CREATE frontend/src/test.ts (642 bytes)
CREATE frontend/src/assets/.gitkeep (0 bytes)
CREATE frontend/src/environments/environment.prod.ts (51 bytes)
CREATE frontend/src/environments/environment.ts (662 bytes)
CREATE frontend/src/app/app-routing.module.ts (246 bytes)
CREATE frontend/src/app/app.module.ts (393 bytes)
CREATE frontend/src/app/app.component.css (0 bytes)
CREATE frontend/src/app/app.component.html (25530 bytes)
CREATE frontend/src/app/app.component.spec.ts (1104 bytes)
CREATE frontend/src/app/app.component.ts (212 bytes)
CREATE frontend/e2e/protractor.conf.js (808 bytes)
CREATE frontend/e2e/tsconfig.json (214 bytes)
CREATE frontend/e2e/src/app.e2e-spec.ts (641 bytes)
CREATE frontend/e2e/src/app.po.ts (262 bytes)
npm WARN registry Using stale data from https://registry.npmjs.org/ because the host is inaccessible -- are you offline?
npm WARN registry Using stale data from https://registry.npmjs.org/ due to a request error during revalidation.
npm WARN deprecated core-js@2.6.11: core-js@<3 is no longer maintained and not recommended for usage due to the number of issues. Please, upgrade your dependencies to the actual version of core-js@3.

> fsevents@1.2.11 install /private/tmp/parent/frontend/node_modules/@angular/compiler-cli/node_modules/fsevents
> node-gyp rebuild

  SOLINK_MODULE(target) Release/.node
  CXX(target) Release/obj.target/fse/fsevents.o
  SOLINK_MODULE(target) Release/fse.node

> fsevents@1.2.11 install /private/tmp/parent/frontend/node_modules/karma/node_modules/fsevents
> node-gyp rebuild

  SOLINK_MODULE(target) Release/.node
  CXX(target) Release/obj.target/fse/fsevents.o
  SOLINK_MODULE(target) Release/fse.node

> fsevents@1.2.11 install /private/tmp/parent/frontend/node_modules/watchpack/node_modules/fsevents
> node-gyp rebuild

  SOLINK_MODULE(target) Release/.node
  CXX(target) Release/obj.target/fse/fsevents.o
  SOLINK_MODULE(target) Release/fse.node

> fsevents@1.2.11 install /private/tmp/parent/frontend/node_modules/webpack-dev-server/node_modules/fsevents
> node-gyp rebuild

  SOLINK_MODULE(target) Release/.node
  CXX(target) Release/obj.target/fse/fsevents.o
  SOLINK_MODULE(target) Release/fse.node

> core-js@2.6.11 postinstall /private/tmp/parent/frontend/node_modules/babel-runtime/node_modules/core-js
> node -e "try{require('./postinstall')}catch(e){}"


> core-js@3.2.1 postinstall /private/tmp/parent/frontend/node_modules/core-js
> node scripts/postinstall || echo "ignore"


> core-js@2.6.11 postinstall /private/tmp/parent/frontend/node_modules/karma/node_modules/core-js
> node -e "try{require('./postinstall')}catch(e){}"


> @angular/cli@8.3.21 postinstall /private/tmp/parent/frontend/node_modules/@angular/cli
> node ./bin/postinstall/script.js

npm WARN karma-jasmine-html-reporter@1.5.1 requires a peer of jasmine-core@>=3.5 but none is installed. You must install peer dependencies yourself.

added 1469 packages from 1071 contributors in 26.319s
    Successfully initialized git.
```
The frontend alone can be started (as usual with Angular) via
```
ng serve
```
called from within the frontend folder. The output should look like that:
```
10% building 3/3 modules 0 activeℹ ｢wds｣: Project is running at http://localhost:4200/webpack-dev-server/
ℹ ｢wds｣: webpack output is served from /
ℹ ｢wds｣: 404s will fallback to //index.html

chunk {main} main.js, main.js.map (main) 49.4 kB [initial] [rendered]
chunk {polyfills} polyfills.js, polyfills.js.map (polyfills) 264 kB [initial] [rendered]
chunk {runtime} runtime.js, runtime.js.map (runtime) 6.15 kB [entry] [rendered]
chunk {styles} styles.js, styles.js.map (styles) 9.71 kB [initial] [rendered]
chunk {vendor} vendor.js, vendor.js.map (vendor) 4.08 MB [initial] [rendered]
Date: 2019-12-28T12:21:18.772Z - Hash: a07b9186628527921b1f - Time: 5585ms
** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **
ℹ ｢wdm｣: Compiled successfully.
```
So the curent page can be visited at http://localhost:4200/ which is especially useful for development.
To build the frontend for deployment the `ng build` command is used
```
Generating ES5 bundles for differential loading...
ES5 bundle generation complete.

chunk {runtime} runtime-es2015.js, runtime-es2015.js.map (runtime) 6.12 kB [entry] [rendered]
chunk {runtime} runtime-es5.js, runtime-es5.js.map (runtime) 6.12 kB [entry] [rendered]
chunk {styles} styles-es2015.js, styles-es2015.js.map (styles) 9.67 kB [initial] [rendered]
chunk {styles} styles-es5.js, styles-es5.js.map (styles) 10.9 kB [initial] [rendered]
chunk {main} main-es2015.js, main-es2015.js.map (main) 48 kB [initial] [rendered]
chunk {main} main-es5.js, main-es5.js.map (main) 51.7 kB [initial] [rendered]
chunk {polyfills-es5} polyfills-es5.js, polyfills-es5.js.map (polyfills-es5) 683 kB [initial] [rendered]
chunk {vendor} vendor-es2015.js, vendor-es2015.js.map (vendor) 3.75 MB [initial] [rendered]
chunk {vendor} vendor-es5.js, vendor-es5.js.map (vendor) 4.53 MB [initial] [rendered]
chunk {polyfills} polyfills-es2015.js, polyfills-es2015.js.map (polyfills) 264 kB [initial] [rendered]
Date: 2019-12-28T12:23:16.466Z - Hash: 6de351d30552553f2e26 - Time: 21773ms
```
One useful parameter is the `deployUrl` if we plan to map it not directly to `/` but to some other url path like `http://localhost:8181/frontend` in the Servlet.
For that case we would call 
```
ng build --deployUrl frontend
```
which automatically rewrites all relative paths to contain the `frontend`.

Now we can move on to add this moduels `pom.xml` which uses mavens ant-plugin to call `ng` automatically during our build:
```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

  <modelVersion>4.0.0</modelVersion>

  <parent>
    <groupId>net.julian</groupId>
    <artifactId>angular-example</artifactId>
    <version>1.0.0-SNAPSHOT</version>
  </parent>

  <artifactId>frontend</artifactId>
  <packaging>bundle</packaging>

  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-antrun-plugin</artifactId>
        <version>1.8</version>
        <executions>
          <execution>
            <id>ng-build</id>
            <phase>generate-resources</phase>
            <goals>
              <goal>run</goal>
            </goals>
            <configuration>
              <target>
                <mkdir dir="target"/>
                <echo message="Generating frontend resource"/>
                <exec executable="ng">
                  <arg value="build"/>
                  <arg value="--deployUrl"/>
                  <arg value="/${deploy.url}/"/>
                </exec>
              </target>
            </configuration>
          </execution>
        </executions>
      </plugin>
      <plugin>
        <groupId>org.apache.felix</groupId>
        <artifactId>maven-bundle-plugin</artifactId>
        <version>3.3.0</version>
        <inherited>true</inherited>
        <extensions>true</extensions>
        <configuration>
          <instructions>
            <Web-ContextPath>/${deploy.url}</Web-ContextPath>
            <Private-Package>*</Private-Package>
            <Include-Resource>dist/test-cli</Include-Resource>
          </instructions>
        </configuration>
      </plugin>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-clean-plugin</artifactId>
        <version>3.1.0</version>
        <configuration>
          <filesets>
            <fileset>
              <directory>dist</directory>
            </fileset>
            <fileset>
              <directory>target</directory>
            </fileset>
          </filesets>
        </configuration>
      </plugin>
    </plugins>

    <pluginManagement>
      <plugins>

      </plugins>
    </pluginManagement>
  </build>

</project>
```
Most parts of this pom are explained in the Linked Blog Post.
The major difference is to add the `deployUrl` via a properties variable as it needs to be set during `ng build` and in the `MANIFEST.MF` (via maven-bundle-plugin).

In our example frontend we use Angulars `HttpClient` to fetch data async from a remote url (which will be provided by our backend).
The Snippet is
```
@Injectable({
  providedIn: 'root'
})
export class DataService {

  private actionUrl: string;

  constructor(private http: HttpClient) {
    this.actionUrl = '/booking';
  }

  public getAll<T>(): Observable<T> {
    return this.http.get<T>(this.actionUrl);
  }

  public getSingle<T>(id: number): Observable<T> {
    return this.http.get<T>(this.actionUrl + id);
  }

  public add<T>(itemName: string): Observable<T> {
    const toAdd = { ItemName: itemName };

    return this.http.post<T>(this.actionUrl, toAdd);
  }

  public update<T>(id: number, itemToUpdate: any): Observable<T> {
    return this.http
      .put<T>(this.actionUrl + id, itemToUpdate);
  }

  public delete<T>(id: number): Observable<T> {
    return this.http.delete<T>(this.actionUrl + id);
  }
}
```
and can be found in the Full Source Code (see Github link below).
So whats left now is to set up an Endpoint in the Backend that serves suitable Content at the `/booking` URL path.

For the Backend create a folder "backend" and add the following `pom.xml``
```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>angular-example</artifactId>
        <groupId>net.julian</groupId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>backend</artifactId>
    <packaging>bundle</packaging>

    <properties>
        <cxf.version>2.2.3</cxf.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.osgi</groupId>
            <artifactId>osgi.cmpn</artifactId>
            <version>6.0.0</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>org.osgi</groupId>
            <artifactId>org.osgi.service.jaxrs</artifactId>
            <version>1.0.0</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-api</artifactId>
            <version>1.7.26</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>javax.ws.rs</groupId>
            <artifactId>javax.ws.rs-api</artifactId>
            <version>2.1</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-annotations</artifactId>
            <version>2.10.0</version>
            <scope>provided</scope>
        </dependency>
        <!-- Debugging only -->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>2.10.0</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.felix</groupId>
                <artifactId>maven-bundle-plugin</artifactId>
                <version>4.2.1</version>
                <extensions>true</extensions>
                <configuration>
                    <exportScr>true</exportScr>
                    <instructions>
                        <Import-Package>org.osgi.*,org.slf4j.*,javax.ws.rs.*,javax.security.*,org.apache.cxf.jaxrs.provider.*,com.fasterxml.jackson.jaxrs.json;resolution:=optional,
                            com.fasterxml.jackson.jaxrs.annotation, com.fasterxml.jackson.jaxrs.base</Import-Package>
                    </instructions>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>8</source>
                    <target>8</target>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>
```

All we need are (provided) maven modules that provide us the necessary Annotations from OSGi, Logging and JAX-RS / Jackson.
We then create a POJO to hold our data, called `Employee` in our case
```
package net.julian;

public class Employee {

    private int id;

    private String employee_name;

    private int employee_salary;

    private int employee_age;

    public Employee() {
    }

    public Employee(int id, String employeeName, int salary, int age) {
        this.id = id;
        this.employee_name = employeeName;
        this.employee_salary = salary;
        this.employee_age = age;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmployee_name() {
        return employee_name;
    }

    public void setEmployee_name(String employee_name) {
        this.employee_name = employee_name;
    }

    public int getEmployee_salary() {
        return employee_salary;
    }

    public void setEmployee_salary(int employee_salary) {
        this.employee_salary = employee_salary;
    }

    public int getEmployee_age() {
        return employee_age;
    }

    public void setEmployee_age(int employee_age) {
        this.employee_age = employee_age;
    }

    @Override
    public String toString() {
        return "Employee{" +
            "id=" + id +
            ", employee_name='" + employee_name + '\'' +
            ", employee_salary=" + employee_salary +
            ", employee_age=" + employee_age +
            '}';
    }
}
``` 
We could add more control over De-/Serializing from / to JSON by using Jackson annotations here.

Then, we have to write our Controler, which looks like that
```
package net.julian;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
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

@Path("/booking")
@JaxrsResource
@Component(immediate = true, service = SimpleServiceImpl.class)
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
    @Path("/")
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<Employee> list() {
        try {
            Thread.sleep((int) (Math.random() * 5_000));
        } catch (InterruptedException e) {
            // Intentionally do nothing
        }
        return employees;
    }

    @GET
    @Path("{id}/")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEmployee(@PathParam("id") int i) {
        try {
            return Response
                .status(Response.Status.OK)
                .entity(employees.get(i))
                .build();
        } catch (IndexOutOfBoundsException e) {
            return Response.
                status(Response.Status.NOT_FOUND)
                .build();
        }
    }

}
```
We added a bit of randomness to simulate slow internet connections (for the frontend) otherwise one would not notice the Async loading effects.

Now all code is finished and we could deploy both to Karaf (and also install the needed dependendencies as bundles or features).
But as this is a fair bit of work in the Karaf Shell we also create a Karaf feature which installs everything at once (easy!).
So, remember the `feature.xml` file in the directory layout?
We now add the following content:
```
<features>

    <repository>mvn:org.apache.aries.jax.rs/org.apache.aries.jax.rs.features/1.0.3/xml</repository>
    <repository>mvn:org.apache.cxf.karaf/apache-cxf/3.1.5/xml/features</repository>

    <feature name="angular-example" version="${project.version}">
        <feature>scr</feature>
        <feature>war</feature>
        <feature>pax-http-whiteboard</feature>
        <feature>http-whiteboard</feature>
        <feature>cxf-jaxrs</feature>
        <feature>aries-jax-rs-whiteboard</feature>
        <feature>aries-jax-rs-whiteboard-jackson</feature>
        <bundle>mvn:net.julian/frontend/${project.version}</bundle>
        <bundle>mvn:net.julian/backend/${project.version}</bundle>
    </feature>

</features>
```

This tells Karaf later that our bundles rely on multiple features to be installed and furthermore it installs both our bunldes, frontend and backend at once.
Now, we call a single
```
mvn clean install
```
To build our modules / bundles and the feature and then, we can go over to our Karaf shell and deploy our complete Application via
```
feature:repo-add mvn:net.julian/angular-example/1.0.0-SNAPSHOT/xml/features
```
and install the feature via
```
feature:install angular-example
```

After that one should find a REST Endpoint at `http://localhost:8181/booking` and the frontend should open when browsing to `http://localhost:8181/my-angular-app/`(which loads data from the backend, of course).

All Code can be found on Bitbucket at https://bitbucket.org/julianfeinauer/angular-demo/src/master/

Have fun!

Credits go to JB Onofree and his awesome and inspiring Blog post  http://blog.nanthrax.net/?p=827!