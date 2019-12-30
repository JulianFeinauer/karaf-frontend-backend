# Prerequisites

AFAIR you need maven, git, node and ng.

# Build 

Build all sources by calling

```
mvn clean install
```
(this will also build all angular frontend stuff)

# Deployment

Then in Karaf add the repository via
```
feature:repo-add mvn:net.julian/angular-example/1.0.0-SNAPSHOT/xml/features
```
and install the feature via
```
feature:install angular-example
```

This will install two bundles, `backend` and `fronted`.
`frontend` contains an angular 8 based Frontend which consumes resources from the backend which is exposed via CXF.

The Frontends can be called via
```
http://localhost:8181/angular/
```
for the pure angular frontend (from Julian) and
```
http://localhost:8181/iconic/
```
 for the iconic frontend (from Niklas).
 
The backend is wired to
```
http://localhost:8181/employee
```
and
```
http://localhost:8181/employee/{id}
```
respectively.