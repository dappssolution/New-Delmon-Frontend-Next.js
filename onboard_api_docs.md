# Onboarding API Documentation

This endpoint is used to complete the initial setup for a user, including saving their WhatsApp number, TRN (if applicable), and creating their primary shipping address.

## Endpoint Details

- **URL:** `/api/onboard`
- **Method:** `POST`
- **Authentication:** Required (Sanctum Bearer Token)
- **Middleware:** `auth:sanctum`, `CheckInactiveUser`

## Request Headers

| Header | Value |
| :--- | :--- |
| `Authorization` | `Bearer {your_access_token}` |
| `Accept` | `application/json` |
| `Content-Type` | `application/json` |

## Request Body Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `address_type` | `string` | **Yes** | The type of address (e.g., `Home`, `Office`, `Warehouse`). |
| `whatsapp` | `string` | No | The user's WhatsApp number. |
| `phone` | `string` | No | The user's main phone number. Will update user profile if currently empty. |
| `trn_number` | `string` | **Required if Office** | The Tax Registration Number. Only required if `address_type` is `Office`. |
| `address` | `string` | **Yes** | The full street address. |
| `country_id` | `integer`| **Yes** | The ID of the country (refer to `/api/countries`). |
| `emirate_id` | `integer`| **Yes** | The ID of the emirate/state (refer to `/api/emirates`). |
| `city` | `string` | No | The city name. |
| `building_details`| `string` | No | Apartment, suite, or building name. |
| `first_name` | `string` | No | Name for the address. Defaults to account name if empty. |
| `email` | `string` | No | Email for the address. Defaults to account email if empty. |
| `post_code` | `string` | No | Postal or ZIP code. |
| `longitude` | `string` | No | GPS Longitude coordinate. |
| `latitude` | `string` | No | GPS Latitude coordinate. |

## Success Response

**Code:** `200 OK`

```json
{
    "status": "success",
    "message": "Onboarding completed successfully",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "whatsapp": "971501234567",
            "trn_number": "100XXXXXXXXXXXX",
            ...
        },
        "address": {
            "id": 15,
            "user_id": 1,
            "address_type": "Office",
            "address": "123 Business Bay",
            "is_primary": true,
            "country_id": 1,
            "emirate_id": 2,
            ...
        }
    }
}
```

## Error Responses

- **401 Unauthorized:** Occurs if the token is invalid or missing.
- **422 Unprocessable Entity:** Occurs if validation fails (e.g., missing `address_type` or missing `trn_number` when type is `Office`).

> [!TIP]
> This endpoint automatically marks the new address as the **primary** address and sets any existing addresses as non-primary.

---

# Onboarding Status Check

This endpoint is used to check if the user has already completed the onboarding requirements. Use this to determine if the "Complete Profile" popup should be shown.

## Endpoint Details

- **URL:** `/api/user/onboarding-status`
- **Method:** `GET`
- **Authentication:** Required (Sanctum Bearer Token)

## Success Response

**Code:** `200 OK`

```json
{
    "status": "success",
    "data": {
        "has_primary_address": false,
        "has_trn": true,
        "should_show_onboard": true
    }
}
```

### Field Definitions:

| Field | Type | Description |
| :--- | :--- | :--- |
| `has_primary_address` | `boolean` | `true` if the user has at least one primary address. |
| `has_trn` | `boolean` | `true` if the user's `trn_number` is set. |
| `has_phone` | `boolean` | `true` if the user's `phone` number is set. |
| `should_show_onboard` | `boolean` | `true` if any of the mandatory info is missing. **Use this flag for the popup condition.** |

---

# Other TRN Update Entry Points

## Checkout / Order Placement
For convenience, when a user places an order via `/api/checkout/place-order`, their `trn_number` is also automatically updated in their profile if:
- `address_type` is `Office`.
- `trn_number` is provided in the request body.

This ensures that even if a user skips the initial onboarding popup, their TRN details are captured when they first attempt to place a business order.
