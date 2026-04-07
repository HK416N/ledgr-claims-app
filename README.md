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

## Response
Every endpoint will return either of these: 

**Success**
```json
//success
{
    "success": true,
    "data": {} 
}
```
or
```json
**Error**
{
    //error
    "success": false,
    "error": "an error message",
    "code": "ERROR_CODE" //refer to ERROR_CODE section
}
```
Check `res.success` first. If `false`, use `res.code` to check for specific errors for error handling on the frontend.

---

## User Object

`"user"` object returned inside `data` upon `"success": true`

for:
`POST /api/auth/signup`, `POST /api/auth/login`

```json
    "user": {
        "_id":   "647f1a...",
        "name":  "John Smith",
        "email": "johnsmith87@gmail.com"
      }
```

| Field | Type | Rule |
|---|---|---|
| `_id` | string | MongoDB generated |
| `name` | string | Full name |
| `email` | string | convert to lowercase |

`hashedPassword` is never returned but it is stored in MongoDB 

---

## Claim Object
for:
- `GET /api/claims`
- `GET /api/claims/:id`
- `POST /api/claims`
- `PUT /api/claims/:id`
---

Exchange data is embedded inside Receipt in MongoDB. The API flattens it into
one object — the frontend never needs to know about the two-level document structure.

```json
{
  "_id":              "683a1f...",
  "receiptNumber":    "INV-8801",
  "date":             "2026-04-01T00:00:00.000",
  "description":      "Client lunch at Raffles Hotel",
  "totalOriginal":    320.00,
  "currencyOriginal": "MYR",
  "tax":              18.40,
  "fxRate":           0.298000,
  "fxSource":         "API",
  "totalSGD":         95.36,
  "isOverseas":       true,
  "status":       false,
  "category":         "Uncategorized",
  "categoryId":       null,
  "imageUrl":         null,
  "createdAt":        "2026-04-01T08:23:11.000Z"
}
```

| Field | Type | Rule |
|---|---|---|
| `_id` | string | MongoDB generated. |
| `receiptNumber` (optional) | string | Use `""` for empty strings. |
| `date` | string | required | `"YYYY-MM-DD"` only. No time component. No timezone suffix. |
| `description` (optional) | string | Use `""` for empty strings. |
| `totalOriginal` | number | 2dp number. |
| `currencyOriginal` | string | ISO 4217. e.g.`"SGD"`, `"USD"`, `"MYR"`. |
| `tax` (optional) | number | `0` if not entered. |
| `fxRate` | number | SGD per 1 unit of original currency. Up to 6dp. |
| `fxSource` | string | `"API"` or `"MANUAL"`. |
| `totalSGD` | number | Server-computed: `totalOriginal` x `fxRate` to 2dp. |
| `isOverseas` | String | Server-computed with `if (currencyOriginal !== "SGD")`. Never sent by client. |
| `status` | String | Default `false`. User sets to `true` once submitted to external portal. Left as string to accomodate future changes. |
| `category` | string | optional | Category name for display. Defaults to `"Uncategorized"` if no category assigned. Never `null` in the response — always a string. |
| `categoryId` (optional) | string\|null | MongoDB ObjectId of the Category document. `null` if no category assigned. |
| `imageUrl` | string\|null | optional | `null` until implementation of image capabilities |
| `createdAt` | string | computed | Full ISO timestamp from Mongoose. For sorting only. |

### Embedded Exchange sub-document

Exchange data lives **inside** the Receipt document in MongoDB — it is not a
separate collection. There is no `Exchange.js` model file.

The Mongoose schema for the embedded object:

```js
exchange: {
    fxRate: { 
        type: Number, 
        required: true 
        },
    convertedAmount: { 
        type: Number, 
        required: true 
        },
}
```

**Flatten for frontend.**

---

## Category Object

for: 

- `GET /api/categories` 
- `POST /api/categories`

```json
{
    "success": true,
    "data": [
        { 
            "_id": "64a3f1...", 
            "name": "Meals" 
            },
        { 
            "_id": "64a3f2...", 
            "name": "Travel" 
            },
        { 
            "_id": "64a3f3...", 
            "name": "Software" 
        }
  ]
}
```

### Field Rules

| Field | Type | Rule |
|-------|------|------|
| `_id` | string | MongoDB ObjectId serialised to string. |
| `name` | string | User-defined label. |

### Relationship

One user has many categories. One user has many receipts. One category has many
receipts. Category is the link between a user's categories and a user's receipts —
it is reusable across many receipts, which is why it is a separate collection
rather than an embedded field.

`userId` on Category scopes every category to its owner — User A's "Meals" and
User B's "Meals" are entirely separate Category documents.

### What is never returned

`userId` is used server-side for ownership checks only. It is never included in
the Category response sent to the frontend.

---

## Date (`createdAt` - for sorting)

- Store in MongoDB as `Date` type - MongoDB stores ISO format "YYYY-MM-DDTHH:mm:ss.sssZ" 
- Z is the timezone offset. Without Z "date-time forms are interpreted as a local time." - [date MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#:~:text=When%20the%20time%20zone%20offset,set%20to%20Z%20(UTC).)
---
**User's input is stored directly in MongoDB.**

**Express:**
```js
date: receipt.Date.(req.body.date)
//MongoDB stores "YYYY-MM-DDTHH:mm:ss.sssZ" 
```
**Retrieve from MongoDB - Use [toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) with slice to remove Z.**

```js
date: receipt.Date.toISOString().slice(0,-1)
//slices out Z leaving "YYYY-MM-DDTHH:mm:ss.sss" 
```

Frontend (pre-filled edit form):

HTML date: `<input type="date">` (works with "YYYY-MM-DD" format)
- remove everything after T for "YYYY-MM-DDTHH:mm:ss.sss" format

```js
value={date.split("T")[0]}
```

QoL change (can be stretch goal): convert to local date format

---

## Request Body

for: 

- `POST /api/claims` 
- `PUT /api/claims/:id`

```json
{
  "receiptNumber":    "INV-8801",
  "date":             "2026-04-01",
  "description":      "Client lunch at Raffles Hotel",
  "totalOriginal":    320.00,
  "currencyOriginal": "MYR",
  "tax":              18.40,
  "fxRate":           0.298000,
  "fxSource":         "API",
  "status":       false,
  "categoryId":       "64a3f1..."
}
```

| Field | Type | Rule |
|---|---|---|
| `receiptNumber` (optional) | string | Use `""` for empty strings. |
| `date` | string | required | `"YYYY-MM-DD"` only. No time component. No timezone suffix. |
| `description` (optional) | string | Use `""` for empty strings. |
| `totalOriginal` | number | 2dp number. |
| `currencyOriginal` | string | ISO 4217. e.g.`"SGD"`, `"USD"`, `"MYR"`. |
| `tax` (optional) | number | `0` if not entered. |
| `fxRate` | number | SGD per 1 unit of original currency. Up to 6dp. |
| `fxSource` | string | `"API"` or `"MANUAL"`. |
| `status` | String | Default `pending`. User sets to `complete` once submitted to external portal. Left as string to accomodate future changes. |
| `category` | string | optional | Category name for display. Defaults to `"Uncategorized"` if no category assigned. Never `null` in the response — always a string. |
| `categoryId` (optional) | string\|null | MongoDB ObjectId of the Category document. `null` if no category assigned. |


- `categoryId` is optional — omit or send `null` if no category selected. Controller defaults `category` to `"Uncategorized"` in the response when `categoryId` is absent
- `status` defaults to `complete` if omitted
- **Completed claims are locked** — PUT and DELETE on a claim where `status === complete` return 403 `CLAIM_IS_COMPLETE`.

### POST /api/categories

```json
{ "name": "Meals" }
```

- `userId` is set server-side from `req.user._id` — never sent by client

---

## FX Rate Precision
- Store as `Number` in MongoDB at 6dp
- Sent as `Number` in JSON at 6dp
- Displayed as 4dp in Dashboard claims list
- Displaed as 6dp in Claim Details 

---

## JWT

For every protected request use:
```
Authorization: Bearer <token>
```
Token payload: { _id, name, email }
Token Expiry: 7 days (do this last)
`verifyToken` uses `req.user._id` for comparing with Mongoose ObjectId where `req.user = { _id, name, email }`

---

## ERROR_CODE

| Code | HTTP | When |
|------|------|------|
| `EMAIL_TAKEN` | 409 | Signup — email already registered |
| `INVALID_CREDENTIALS` | 401 | Login — wrong email or password |
| `NO_TOKEN` | 401 | Protected route — no Authorization header |
| `INVALID_TOKEN` | 401 | Protected route — token malformed or expired |
| `MISSING_DATE` | 400 | Claim body — `date` missing or empty |
| `MISSING_AMOUNT` | 400 | Claim body — `totalOriginal` missing or ≤ 0 |
| `MISSING_CURRENCY` | 400 | Claim body — `currencyOriginal` missing or empty |
| `MISSING_FX_RATE` | 400 | Claim body — `fxRate` missing or ≤ 0 |
| `CLAIM_NOT_FOUND` | 404 | No receipt found with that `_id` |
| `FORBIDDEN` | 403 | Claim exists but belongs to a different user |
| `SERVER_ERROR` | 500 | Unhandled server exception |

---

## Route Paths

### Backend
| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/signup` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/claims` | Required |
| GET | `/api/claims/:id` | Required |
| GET | `/api/fx/latest` | Required |
| GET | `/api/categories` | Required |
| POST | `/api/claims` | Required |
| PUT | `/api/claims/:id` | Required |
| DELETE | `/api/claims/:id` | Required |
| POST | `/api/categories` | Required |
| DELETE | `/api/categories/:id` | Required |

### Frontend
| Path | Page | Owner |
|------|------|-------|
| `/login` | Login |
| `/signup` | Signup |
| `/dashboard` | Dashboard |
| `/history` | Claims History |
| `/claims/:id` | Claim Detail |
| `/claims/new` | New Claim |
| `/claims/:id/edit` | Edit Claim |

---

