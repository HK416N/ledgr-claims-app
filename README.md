# Background

## Ledgr - The Expense Claim Management App

Employees who travel frequently often need to manually key in receipt details into a claims system, which is time-consuming and inefficient.

This application is designed to simplify that process by structuring receipt data into a clean, reusable format for claims submission.

This application is also designed around 3 build phases:

Phase 1: MVP

Stretch goals:

Phase 2: Image handling

Phase 3: OCR via tesseract.js

## Current Scope - MVP

The immediate deliverable focuses on **manual input of receipt data** rather than OCR or image uploads. This ensures:
- A stable and reliable data model
- Clean API design and validation
- Proper handling of currency conversion and categorisation

Must have (Phase 1):
1. JWT-based authentication (Signup / Login / Logout) 
2. Editable extracted data (OCR is not trusted blindly) 
3. Automatic SGD conversion using FX rate 
4. Claim history dashboard
5. Category tagging system

### What the App Currently Solves

- Allows users to manually input receipt details
- Structures data for easy claims submission
- Converts foreign currency into SGD
- Stores and organises claims for retrieval

### Planned Enhancements

1. Receipt image upload
2. OCR-based data extraction
3. Editable OCR results before saving

The system is designed with **accuracy, editability, and scalability** in mind — starting with a strong manual workflow before introducing OCR automation.

## Tech Stack

Github monorepo - frontend & backend
Frontend -> Netlify
Backend -> Render/Railway

### Frontend

**React**
**React Router** 
**Tailwind CSS** 


### Backend 

**Node.js (Bun runtime)** 
**Express** 
**MongoDB + Mongoose** 
**JWT Authentication** 
**Morgan (logging)** 

### OCR & Data Processing

**tesseract.js** (OCR text extraction) 
**Regex parsing** (structured data extraction)

## User Stories

### Sign in

As a user I want to:
 - enter my email and my password into fields and click `sign in` or press `Enter` on my keyboard to log in.
 - be able to sign up for a new account if i do not have an existing account
reset my password if I have forgotten it.

### Sign up

As a user I want to:
- enter the email I wish to sign up with
- enter the password I wish to use
- enter the password I wish to use a second time as a confirmation
- click the `Submit` button or press `Enter` on my keyboard to complete the sign up process 

### Dashboard

As a user I want to:
- see the `dashboard` after I complete the `sign in`/ `sign up` process
- see `receipt/invoice number`, `date`, `description`, `category`, `original currency value`, `fx rate` and `SGD equivalent` and actions I can take to interact with individual claims.
- be able to interact with each claim on the list by clicking one of 3 buttons, `Complete`, `Edit` or `Delete`.
- see a detailed view of the claim that I clicked `View` on.
- be able to delete any claim entry by clicking `Delete`
- be able to remove completed claims from the list by clicking `Complete`
- see a confirmation window upon clicking `Delete`
- be able to create new claims when I click a `New Claim` button

### New Claim

As a user I want to:
- enter `receipt/invoice no.`, `receipt date`, `currency`, `receipt amount`, `fx rates`, `tax` and a short `description` of the expense.
- see `SGD` value auto converted from the `original currency` and `fx rates`
- be able to go back to the `dashboard`
- cancel the process with a cancel button

### Claim Details

As a user, I want to see:
- the `receipt/ invoice number` and `date` of the receipt so I am able to confirm that I am viewing the correct receipt
- see all details of the receipt and be able to copy them to clipboard for easy entry into a claims portal
- be able to edit the details to correct any erroneous entries
- be able to delete the claim if I accidentally submit the details of the wrong receipt or accidentally enter the same receipt twice
- be able to check of the entry as complete by clicking on a `complete` button

### Claims History

As a user I want to:
- see a list of my completed claims in a claims history page so I can track my completed claims
- see `receipt/invoice number`, `date`, `description`, `category`, `original currency value`, `fx rate` and `SGD equivalent`.

**I expect to be unable to delete or edit claims after completion**

### Edit claim

As a user I want to:
- see a prefilled form of the claim that I wish to edit
- I want to be able to change the details in this form to edit the claim details


---

Project planning done with the assistance of Claude AI.

Click [here](./docs/plans.md) for project plans

---

## Wireframes

wip

---

## Attributions

- [Backend](./backend/attributions.md)

- [Frontend](./frontend/attributions.md)