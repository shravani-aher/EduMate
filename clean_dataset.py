import pandas as pd

# Load master dataset
df = pd.read_csv("edumate_dataset.csv")

print("Original rows:", len(df))

# Remove records where percentile is 0
# These are the 23 TFWS records identified earlier.
df_ml = df[df["percentile"] > 0].copy()

print("Rows after removing zero percentiles:", len(df_ml))
print("Rows removed:", len(df) - len(df_ml))

# Make sure percentile is numeric
df_ml["percentile"] = pd.to_numeric(
    df_ml["percentile"],
    errors="coerce"
)

# Remove any rows that became invalid
df_ml = df_ml.dropna(
    subset=["percentile"]
)

# Save cleaned dataset
df_ml.to_csv(
    "edumate_ml_dataset.csv",
    index=False
)

print("\n==============================")
print("ML DATASET CREATED")
print("==============================")

print("Rows:", len(df_ml))
print("Columns:", len(df_ml.columns))

print("\nPercentile range:")
print("Minimum:", df_ml["percentile"].min())
print("Maximum:", df_ml["percentile"].max())

print("\nMissing values:")
print(df_ml.isnull().sum())