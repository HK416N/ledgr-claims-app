# ledgr - Claims App

### *READ BEFORE WRITING ANY CODE*

## Background (wip)


[generate random string for JWT_SECRET](https://dev.to/tkirwa/generate-a-random-jwt-secret-key-39j4)
using terminal: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

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

Within `data`:
```json
//success
{
    "success": true,
    "data": {
        "token": "token-string",
        "user": {
            "user-object"
            }
    }
}
```
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
```json
{
    "_id":              "683a1f...",
    "receiptNumber":    "INV-8801",
    "date":             "2026-04-01",
    "description":      "Client lunch at Raffles Hotel",
    "totalOriginal":    320.00,
    "currencyOriginal": "MYR",
    "tax":              18.40,
    "fxRate":           0.298000,
    "fxSource":         "API",
    "totalSGD":         95.36,
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
| `imageUrl` (optional) | string\|null | `null` until implementation of image capabilities|
| `createdAt` | string | Full ISO timestamp from Mongoose. For sorting only. |
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

## Request Body
for: 
- `POST /api/claims`
- `PUT /api/claims/:id`

```json
{
    "receiptNumber":    "INV-8801",
    "date":             "2026-04-01",
    "description":      "Client lunch",
    "totalOriginal":    320.00,
    "currencyOriginal": "MYR",
    "tax":              18.40,
    "fxRate":           0.298000,
    "fxSource":         "API"
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

NOTE:  
1. `totalSGD` is never sent by the client as it is server-computed using `totalOrginal x fxRate` (to 2dp)
2. `imageUrl` is not part of MVP and thus will be handled separately.

## FX Rate Precision
- Store as `Number` in MongoDB at 6dp
- Sent as `Number` in JSON at 6dp
- Displayed as 4dp in Dashboard claims list
- Displaed as 6dp in Claim Details 

## JWT

For every protected request use:
```
Authorization: Bearer <token>
```
Token payload: { _id, name, email }
Token Expiry: 7 days (do this last)
`verifyToken` uses `req.user._id` for comparing with Mongoose ObjectId where `req.user = { _id, name, email }`

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

## ROUTES

### Backend
| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/signup`| Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/claims` | Required |
| GET | `/api/claims/:id` | Required |
| GET | `/api/fx/latest` | Required |
| POST | `/api/claims` | Required |
| PUT | `/api/claims/:id` | Required |
| DELETE | `/api/claims/:id` | Required |
 
### Frontend
| Path | Page |
|------|------|
| `/login` | Login | 
| `/signup` | Signup |
| `/dashboard` | Dashboard |
| `/claims/:id` | Claim Detail |
| `/claims/new` | New Claim |
| `/claims/:id/edit` | Edit Claim |

