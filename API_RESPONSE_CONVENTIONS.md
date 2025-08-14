# API Response Convention

## Général Structure

All API responses must follow a consistent structure to ensure clarity and uniformity in the application.

```json
{
  "message": string,
  "data": {} | [] | null,
  "errors": [
    {
      "code": string,
      "type": "critical" | "informative" | "warning"
    }
  ]
}
```

## Response Structure Components

### Message

- A brief description of the content of the response

### Data

- Must contain the requested resource (object or list).
- If no data is returned, return `null`.

### Errors

- Always in list form.
- Contains :
  - `code` : Internal error code specified in tickets to facilitate the translation of user messages. These codes are stored in language files.
  - `type` : A classification of the error (`critical`, `informative`, `warning`). Allows the error to be displayed to the user with the correct color code.
