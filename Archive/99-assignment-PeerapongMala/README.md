[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=15491364)


# I am making User management system
>start with relationship of the entities

# Entities
Permission - Permission to access data.<br/>
Role - Role for user<br>
User - indicate user<br>
userprofile - indicate user data.<br>

## Relationships
One-to-Many: A Permission can have multiple Role.<br>
Many-to-One: Multiple Persmisstion belong to one User.<br>
One-to-One: A User can be assigned to one userprofile.<br>
Many-to-Many: An User have multiple userprofile, and a User can be owned by Permission.<br>


# Task[Personal]
>To do list for myself<br><br>
- [x] Edit README.md<br>
- [x] Tried running the sample file check if there is an issues <br>
- [x] Create Entities classes<br>
- [x] Realized what DTO is.<br>
```
A Data Transfer OBject(DTO) 
Usage is to encapsulate the data and simplify the usage.
Acording to chat GPT answer and reading throught reddit threads,

Key of benefits of using it really are 
1.Data Encapsulation
2.Reduceing numbers of calls between client and server[fetch all necessary in one go]

- [x] Learning About H2 database!
> [where I was reading](https://www.baeldung.com/spring-boot-h2-database) and [Another Web I also Reads](https://www.geeksforgeeks.org/spring-boot-with-h2-database/)