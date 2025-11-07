# Research Spike: PHP Post and Redirect Automation

## Goal

In PHP, when a user clicks on a link on the LigerBots website to visit the
Carpool App, we need to share user details with the CarPool App in a secure manner.

## Solution

We propose a two-phase process allowing a user to link to the CarPool App while
first sharing user data and then redirecting the user to the CarPool App URL.

## Proposed Workflow

- Assume a SHARED_SECRET:string known to both Carpool App (CA) and LigerBots website (LB)

### LigerBots Web Site

1. Create a unique id `UID` from current user record
2. Create a payload from current user record as

    ```json
    {
      "uid": "UID",
      "firstname": "string",
      "lastname": "string",
      "phonenum": "string",
      "email": "string"
    }
    ```

3. Compute a hash of the payload and insert it into payload at `HASH`

    - payload is now:

      ```json
        {
          "uid": "UID",
          "firstname": "string",
          "lastname": "string",
          "phonenum": "string",
          "email": "string",
          "HASH": "HASH of payload"
        }
      ```

4. Encrypt payload with UID + SHARED_SECRET
5. POST <https://carpool:PORT/UID> with

    ```json
      {
        "uid": "UID",
        "data": "Base64-Encoded encrypted data"
      }
    ```

- if the POST fails
  - notify user that carpool app is unavailable and to try again later.
- else
  - REDIRECT to <https://carpool?uid=UID>

### Carpool App

1. on POST from LigerBots website:

    - Decode payload.data using payload.UID + SHARED_SECRET
    - If unable to reconstruct user information
      - return 404
    - else
      - Save user data in local DB, indexed by UID

2. on GET <https://carpool?uid=UID>

    - if user does not exist in DB
      - return 404
    - else
      - allow user to access the app

## Testing Notes

TBD
