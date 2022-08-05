# Reimbursement Calculation Application
The purpose of this app is to make claims for business trip reimbursements. It also allows administrator to change reimbursement parameters.

This is somewhat a prototype because is not adapted for end user. It is missing login system and administrator panel is available for every user.

# How to use?
On the root page there are two button. One will redirect to the admin panel and the other to add new claim.

In the admin panel it is possible to change reimbursement parameters like max reimbursement limit, daily allowance and car mileage. User can also add/remove/modify types of receipts and their limits.

In the add new claim page user can pick period for which they need daily allowance, input personal car mileage and add up to five receipts choosing their type and price. The value of the receipt cannot exceed the limit for a picked type.  After every change total cost is recalculated and shown on the bottom of the form. Total cost will not exceed the maximum available reimbursement which is shown below the sum.

# How to build application?
After unpacking project archive open terminal and move to backend directory. To build and run backend use command:

`mvn compile exec:java`

To run tests use command:

`mvn clean test`


Next go to frontend directory. First install all dependencies using yarn:

`yarn`

After that you can build application using command:

`yarn build`

Finally to start frontend use command:

`serve -s build`

Application can be accessed at `localhost:3000`
