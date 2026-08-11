import pandas as pd

df = pd.read_csv("edumate_dataset.csv")

print("\n==============================")
print("DATASET ANALYSIS")
print("==============================")

print("\n1. DATASET SIZE")
print("Rows:", len(df))
print("Columns:", len(df.columns))

print("\n2. YEARS")
print(df["year"].value_counts().sort_index())

print("\n3. UNIQUE VALUES")
print("Colleges:", df["college"].nunique())
print("Branches:", df["branch"].nunique())
print("Seat types:", df["seat_type"].nunique())
print("Stages:", df["stage"].unique())

print("\n4. PERCENTILE RANGE")
print("Minimum:", df["percentile"].min())
print("Maximum:", df["percentile"].max())
print("Mean:", df["percentile"].mean())
print("Median:", df["percentile"].median())

print("\n5. TOP COLLEGES BY NUMBER OF RECORDS")
print(df["college"].value_counts().head(10))

print("\n6. TOP BRANCHES")
print(df["branch"].value_counts().head(15))

print("\n7. MOST COMMON SEAT TYPES")
print(df["seat_type"].value_counts().head(20))

print("\n8. SAMPLE OF UNIQUE SEAT TYPES")
print(sorted(df["seat_type"].unique())[:50])

print("\n9. DUPLICATES")
print("Exact duplicate rows:", df.duplicated().sum())

print("\n10. SAME COLLEGE + BRANCH + SEAT TYPE ACROSS YEARS")
grouped = (
    df.groupby(["college", "branch", "seat_type"])
    ["year"]
    .nunique()
)

print(
    "Groups appearing in all 3 years:",
    (grouped == 3).sum()
)

print(
    "Groups appearing in 2+ years:",
    (grouped >= 2).sum()
)