import pandas as pd


# ==========================================
# LOAD DATA
# ==========================================

df = pd.read_csv("edumate_features.csv")


# ==========================================
# FIND RELEVANT SEAT TYPES
# ==========================================

def get_seat_types(category, gender):

    category = category.upper()
    gender = gender.upper()

    # General seats vs Ladies seats
    prefix = "L" if gender == "FEMALE" else "G"

    # Category codes used in the dataset
    category_codes = {
        "OPEN": "OPEN",
        "OBC": "OBC",
        "SC": "SC",
        "ST": "ST",
        "VJ": "VJ",
        "NT1": "NT1",
        "NT2": "NT2",
        "NT3": "NT3",
        "EWS": "EWS"
    }

    category_code = category_codes.get(category)

    if category_code is None:
        raise ValueError("Invalid category")

    # Consider Home, Other and State-level seats
    return [
        prefix + category_code + "H",
        prefix + category_code + "O",
        prefix + category_code + "S"
    ]


# ==========================================
# COLLEGE RECOMMENDATION
# ==========================================

def recommend_colleges(
    percentile,
    category,
    gender,
    branch,
    city
):

    # --------------------------------------
    # Get relevant seat types
    # --------------------------------------

    seat_types = get_seat_types(category, gender)

    print("\nUsing seat types:", seat_types)


    # --------------------------------------
    # Filter branch
    # --------------------------------------

    results = df[
        df["branch"].str.contains(
            branch,
            case=False,
            na=False
        )
    ].copy()


    # --------------------------------------
    # Filter city
    # --------------------------------------

    if city:
        results = results[
            results["college"].str.contains(
                city,
                case=False,
                na=False
            )
        ]


    # --------------------------------------
    # Filter seat types
    # --------------------------------------

    results = results[
        results["seat_type"].isin(seat_types)
    ]


    # --------------------------------------
    # Check if anything was found
    # --------------------------------------

    if results.empty:
        return pd.DataFrame()


    # --------------------------------------
    # Calculate historical cutoff
    # for each college
    # --------------------------------------

    college_cutoffs = (
        results
        .groupby("college")
        .agg(
            historical_cutoff=("percentile", "mean"),
            latest_cutoff=("percentile", "max"),
            records=("percentile", "count")
        )
        .reset_index()
    )


    # --------------------------------------
    # Difference between student's
    # percentile and historical cutoff
    # --------------------------------------

    college_cutoffs["difference"] = (
        percentile
        - college_cutoffs["historical_cutoff"]
    )


    # --------------------------------------
    # Classify colleges
    # --------------------------------------

    def classify(diff):

        if diff >= 1.5:
            return "SAFE"

        elif diff >= 0:
            return "MODERATE"

        else:
            return "AMBITIOUS"


    college_cutoffs["category"] = (
        college_cutoffs["difference"]
        .apply(classify)
    )


    # --------------------------------------
    # Pick up to 2 colleges from each category
    # --------------------------------------

    safe = (
        college_cutoffs[
            college_cutoffs["category"] == "SAFE"
        ]
        .sort_values(
            "historical_cutoff",
            ascending=False
        )
        .head(2)
    )


    moderate = (
        college_cutoffs[
            college_cutoffs["category"] == "MODERATE"
        ]
        .sort_values(
            "historical_cutoff",
            ascending=False
        )
        .head(2)
    )


    ambitious = (
        college_cutoffs[
            college_cutoffs["category"] == "AMBITIOUS"
        ]
        .sort_values(
            "historical_cutoff",
            ascending=False
        )
        .head(2)
    )


    # --------------------------------------
    # Combine results
    # --------------------------------------

    final_results = pd.concat(
        [
            safe,
            moderate,
            ambitious
        ],
        ignore_index=True
    )


    return final_results


# ==========================================
# TEMPORARY TEST
# ==========================================

if __name__ == "__main__":

    results = recommend_colleges(
        percentile=99.8,
        category="OBC",
        gender="FEMALE",
        branch="Computer Engineering",
        city="Pune"
    )


    print("\n==============================")
    print("EDUMATE TEST RESULTS")
    print("==============================")


    if results.empty:

        print("No matching colleges found.")

    else:

        print(
            results[
                [
                    "college",
                    "latest_cutoff",
                    "historical_cutoff",
                    "difference",
                    "category"
                ]
            ].to_string(index=False)
        )