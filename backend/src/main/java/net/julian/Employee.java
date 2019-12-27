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
