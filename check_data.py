import pandas as pd

df = pd.read_csv("edumate_dataset.csv")

print("\n==============================")
print("CHECKING ZERO PERCENTILES")
print("==============================")

zero_df = df[df["percentile"] == 0]

print("\nTotal zero-percentile records:")
print(len(zero_df))

print("\nZero percentile by year:")
print(zero_df["year"].value_counts().sort_index())

print("\nZero percentile by seat type:")
print(zero_df["seat_type"].value_counts().head(30))

print("\nSample zero-percentile records:")
print(
    zero_df[
        [
            "year",
            "college",
            "branch",
            "stage",
            "seat_type",
            "merit_rank",
            "percentile"
        ]
    ].head(30).to_string(index=False)
)