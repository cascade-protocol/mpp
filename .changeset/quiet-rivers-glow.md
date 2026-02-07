---
"mpay": major
---

**Breaking:** Renamed `method` to `methods` on `Challenge.from()`, `Challenge.deserialize()`, `Challenge.fromHeaders()`, and `Challenge.fromResponse()`.

```diff
- const challenge = Challenge.fromResponse(response, { method })
+ const challenge = Challenge.fromResponse(response, { methods })

- const challenge = Challenge.deserialize(value, { method })
+ const challenge = Challenge.deserialize(value, { methods })
```
