# Usal Project
Shopify Theme Docs




## Padding

Current padding is set to 24px. Rather than putting padding on the containers, we are using calc() to compensate for the margin we're adding.

### example:
```
element {
    width: calc(100% - 48px);
    margin: auto 24px;
}
```
