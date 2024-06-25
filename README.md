# Spark Release Tag

Built to increment a number by either `1` or `.1` depending whether `major` or `minor` is passed.

By default `minor` is the `bump_type`

## Usage

```yaml
- name: TAG
  uses: ag10717/spark-release-tag@v1
  with:
    bump_type: "<major>|<minor>"
```

