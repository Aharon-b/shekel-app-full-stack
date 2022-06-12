# shekel-app-full-stack-
Shekel - an organization for people with special needs. Organizational hierarchy:
 Administrator (can be more than one)
 Coordinators
 Width guides
 Guides

- admin: Responsible for all registrations / deletions of users.
Coordinator: Responsible for a number of apartments (usually 5).
- Each apartment has a number of guides who do shifts in the apartment.
- Each coordinator has a width guide who is responsible for the logistics in the apartment.

 (Each user can have several roles)

The app is primarily designed to provide information to instructors about their apartments (a guide can be in more than one apartment).

Guide:

- list of guide's apartments.
- List of tenants in each apartment.
- Information on each tenant (general details + chores list + medicine list)
- The app gives each guide the option to request a replacement for his shift + offer himself for a replacement.
- Each guide has a replacement page where there are all the replacement requests of other guides in the system (can offer itself for one of the replacements) + replacement requests that belong to guide + replacement proposals that belong to guide (under each offer there are all requests in the system that match the offer) + offers Replacement belonging to guide approved by the coordinator of the apartment.

Width guide:

- See the list of apartments that belong to its coordinator.
- Can add / update details / delete from the chores / medcine list.
- Add a replacement request to one of the apartments on the list.

Coordinator:

- Can delete an apartment from the list of apartments.
- Can delete a tenant from the list of tenants of an apartment.
- Can add guides from the system to the list of guides of the apartment.
- Update details of tenant / apartment.
- Can add / update details / delete from the chores / medcine list.
- Can add a replacement request to one of the apartments on the list.
- Can approve / reject replacement requests that belong to his apartments.

Admin:

- Can add a guide / tenant / coordinator / width guide / apartment to the system and also delete them from the system.
- Can add a guide without an apartment to one of the apartments in the system.
- Can add an apartment without a coordinator to the list of apartments of a coordinator.
- Can add a tenant without an apartment to one of the apartments in the system.
- Can add a directory as an operational coordinator to one of the coordinators in the system.
- Can add a new administrator or one of the users as an administrator.
- Can delete his account from the system.
