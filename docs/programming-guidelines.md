# Programming Guidelines 📜

## 🏗 Controller Rules

1. **Do not pass the Request Object beyond the controller.** Extract all required properties in the controller itself and pass only the necessary data to the service layer.
2. **Controllers should not contain logic, message updates, or conditions.** The sole responsibility of the controller is to receive user requests, forward them to the service layer, and return the service response without modifications.
3. **Only controllers should send responses to the front-end or API.** Never send responses directly from the service layer or any other part of the application.
4. **Every function in the controller must include a try-catch block** to handle errors gracefully.

---

## ⚖ General Rules

1. **Do not create functions that accept more than two parameters.** If a function requires multiple arguments, pass an object containing all necessary properties instead.

---

## 📂 File Structure
To properly integrate these guidelines into the repository, you can organize them as follows:

```
├── docs/
│   ├── programming-guidelines.md   # This document
│   ├── api-documentation.md        # API docs (if applicable)
│   ├── architecture.md             # System architecture overview
│
├── src/
│   ├── controllers/                # Controller files
│   ├── services/                   # Business logic
│   ├── models/                      # Database models
│
├── README.md                       # Main repository documentation
├── CONTRIBUTING.md                  # Contribution guidelines
├── CODE_OF_CONDUCT.md                # Community behavior rules
```

This structure keeps the project well-organized and ensures that programming rules are properly documented in the `docs/` folder. Let me know if you want to add anything else! 🚀

