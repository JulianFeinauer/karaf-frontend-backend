package net.julian;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Employee {

    private int id;

    @JsonProperty("employee_name")
    private String employeeName;

    @JsonProperty("employee_salary")
    private int employeeSalary;

    @JsonProperty("employee_age")
    private int employeeAge;

    public Employee() {
    }

    public Employee(int id, String employeeName, int salary, int age) {
        this.id = id;
        this.employeeName = employeeName;
        this.employeeSalary = salary;
        this.employeeAge = age;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public int getEmployeeSalary() {
        return employeeSalary;
    }

    public void setEmployeeSalary(int employeeSalary) {
        this.employeeSalary = employeeSalary;
    }

    public int getEmployeeAge() {
        return employeeAge;
    }

    public void setEmployeeAge(int employeeAge) {
        this.employeeAge = employeeAge;
    }

    @Override
    public String toString() {
        return "Employee{" +
            "id=" + id +
            ", employee_name='" + employeeName + '\'' +
            ", employee_salary=" + employeeSalary +
            ", employee_age=" + employeeAge +
            '}';
    }
}
