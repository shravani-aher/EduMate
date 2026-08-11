import pandas as pd

# Load the three yearly datasets
df_2023 = pd.read_csv("cutoffs_2023_test.csv")
df_2024 = pd.read_csv("cutoffs_2024_test.csv")
df_2025 = pd.read_csv("cutoffs_test.csv")

# Add year information
df_2023["year"] = 2023
df_2024["year"] = 2024
df_2025["year"] = 2025

# Combine all three datasets
df = pd.concat(
    [df_2023, df_2024, df_2025],
    ignore_index=True
)

# Put year first
df = df[
    [
        "year",
        "college",
        "branch_code",
        "branch",
        "stage",
        "seat_type",
        "merit_rank",
        "percentile"
    ]
]

# Remove exact duplicate rows
df = df.drop_duplicates()

# Save master dataset
df.to_csv(
    "edumate_dataset.csv",
    index=False
)

print("\n==============================")
print("EDUMATE DATASET CREATED")
print("==============================")

print("Total rows:", len(df))
print("Total columns:", len(df.columns))

print("\nRows by year:")
print(df["year"].value_counts().sort_index())

print("\nUnique colleges:", df["college"].nunique())
print("Unique branches:", df["branch"].nunique())
print("Unique seat types:", df["seat_type"].nunique())

print("\nMissing values:")
print(df.isnull().sum())

print("\nFirst 10 rows:")
print(df.head(10).to_string(index=False))