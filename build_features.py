import pandas as pd

# Load cleaned dataset
df = pd.read_csv("edumate_ml_dataset.csv")

print("Original records:", len(df))

# --------------------------------------------------
# Extract information from seat_type
# --------------------------------------------------

def get_seat_class(code):
    if code.startswith("L"):
        return "LADIES"
    elif code.startswith("G"):
        return "GENERAL"
    elif code.startswith("DEF"):
        return "DEFENCE"
    else:
        return "OTHER"


def get_category(code):
    code = code.replace("DEF", "")

    if "OPEN" in code:
        return "OPEN"
    elif "OBC" in code:
        return "OBC"
    elif "SC" in code:
        return "SC"
    elif "ST" in code:
        return "ST"
    elif "EBC" in code:
        return "EBC"
    elif "VJ" in code:
        return "VJ"
    elif "NT1" in code:
        return "NT1"
    elif "NT2" in code:
        return "NT2"
    elif "NT3" in code:
        return "NT3"
    elif "EWS" in code:
        return "EWS"
    elif "TFWS" in code:
        return "TFWS"
    else:
        return "OTHER"


def get_university_type(code):
    if code.endswith("H"):
        return "HOME"
    elif code.endswith("O"):
        return "OTHER"
    elif code.endswith("S"):
        return "STATE"
    else:
        return "OTHER"


# Create new features
df["seat_class"] = df["seat_type"].apply(get_seat_class)
df["category"] = df["seat_type"].apply(get_category)
df["university_type"] = df["seat_type"].apply(get_university_type)


# --------------------------------------------------
# Display results
# --------------------------------------------------

print("\n==============================")
print("FEATURE EXTRACTION")
print("==============================")

print("\nSeat class:")
print(df["seat_class"].value_counts())

print("\nCategory:")
print(df["category"].value_counts())

print("\nUniversity type:")
print(df["university_type"].value_counts())

print("\nSample:")
print(
    df[
        [
            "seat_type",
            "seat_class",
            "category",
            "university_type"
        ]
    ].drop_duplicates().head(30).to_string(index=False)
)


# Save
df.to_csv(
    "edumate_features.csv",
    index=False
)

print("\nSaved as: edumate_features.csv")