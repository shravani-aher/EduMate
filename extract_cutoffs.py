import pdfplumber
import re
import pandas as pd

PDF_FILE = "2025ENGG_CAP1_CutOff.pdf"

# For now, test only the first 5 pages
TEST_PAGES = 1566

records = []


# ---------------------------------------------------
# Helper functions
# ---------------------------------------------------

def is_college_line(line):
    return re.match(r"^\d{5}\s*-\s*.+", line) is not None


def is_branch_line(line):
    return re.match(r"^\d{10}\s*-\s*.+", line) is not None


def is_category(token):
    """
    Recognise the seat-type/category codes used
    in the CET PDF.
    """

    if token in ["EWS", "ORPHAN", "TFWS"]:
        return True

    return re.match(
        r"^(G|L|PWD|DEF)[A-Z0-9]+$",
        token
    ) is not None


def is_category_header(line):
    """
    A category header contains multiple seat-type codes.
    """

    tokens = line.replace("Stage ", "").split()

    categories = [
        token for token in tokens
        if is_category(token)
    ]

    return len(categories) >= 2


def get_categories(line):
    """
    Extract only category names from a header.
    """

    tokens = line.replace("Stage ", "").split()

    return [
        token for token in tokens
        if is_category(token)
    ]


def is_stage_line(line):
    """
    Detect lines such as:

    I 37591 58518 ...
    II 196674
    """

    return re.match(
        r"^(I|II|III|IV)(\s|$)",
        line
    ) is not None


def extract_stage_and_ranks(line):
    """
    Extract stage and merit ranks.

    Example:

    I 37591 58518 94334

    becomes:

    stage = I
    ranks = [37591, 58518, 94334]
    """

    parts = line.split()

    stage = parts[0]

    ranks = []

    for value in parts[1:]:

        if value.isdigit():
            ranks.append(int(value))

        elif value == "-":
            ranks.append(None)

    return stage, ranks


def extract_percentiles(line):
    """
    Extract values inside brackets.

    Example:

    (88.9550679) (82.3322294)

    becomes:

    [88.9550679, 82.3322294]
    """

    values = re.findall(
        r"\(([\d.]+)\)",
        line
    )

    return [
        float(value)
        for value in values
    ]


# ---------------------------------------------------
# Read PDF
# ---------------------------------------------------

print("Reading PDF...")

with pdfplumber.open(PDF_FILE) as pdf:

    total_pages = min(TEST_PAGES, len(pdf.pages))

    print(f"Testing first {total_pages} pages...\n")

    current_college = None
    current_branch = None
    current_branch_code = None

    for page_number in range(total_pages):

        print(f"Processing page {page_number + 1}/{total_pages}")

        page = pdf.pages[page_number]

        text = page.extract_text()

        if not text:
            continue

        lines = [
            line.strip()
            for line in text.split("\n")
            if line.strip()
        ]

        i = 0

        while i < len(lines):

            line = lines[i]

            # ---------------------------------------
            # COLLEGE
            # ---------------------------------------

            if is_college_line(line):

                match = re.match(
                    r"^(\d{5})\s*-\s*(.+)",
                    line
                )

                current_college = match.group(2)
                i += 1
                continue


            # ---------------------------------------
            # BRANCH
            # ---------------------------------------

            if is_branch_line(line):

                match = re.match(
                    r"^(\d{10})\s*-\s*(.+)",
                    line
                )

                current_branch_code = match.group(1)
                current_branch = match.group(2)

                i += 1
                continue


            # ---------------------------------------
            # CATEGORY HEADER
            # ---------------------------------------

            if is_category_header(line):

                categories = get_categories(line)

                # Move forward until we find
                # a Stage line such as I / II / III / IV

                j = i + 1

                while j < len(lines):

                    next_line = lines[j]

                    # Sometimes PDF extraction splits
                    # the final "S" onto its own line.
                    if next_line == "S":
                        j += 1
                        continue

                    if is_stage_line(next_line):
                        break

                    # Stop if a new branch starts
                    if is_branch_line(next_line):
                        break

                    j += 1


                # -----------------------------------
                # STAGE + RANKS
                # -----------------------------------

                while j < len(lines):

                    stage_line = lines[j]

                    if not is_stage_line(stage_line):
                        break

                    stage, ranks = extract_stage_and_ranks(
                        stage_line
                    )

                    # Next line should contain percentiles
                    if j + 1 >= len(lines):
                        break

                    percentile_line = lines[j + 1]

                    percentiles = extract_percentiles(
                        percentile_line
                    )

                    # --------------------------------
                    # Match categories with values
                    # --------------------------------

                    count = min(
                        len(categories),
                        len(ranks),
                        len(percentiles)
                    )

                    for k in range(count):

                        records.append({
                            "college": current_college,
                            "branch_code": current_branch_code,
                            "branch": current_branch,
                            "stage": stage,
                            "seat_type": categories[k],
                            "merit_rank": ranks[k],
                            "percentile": percentiles[k]
                        })

                    # Move to next possible stage
                    j += 2

                    # Skip a stray "S" created by PDF extraction
                    if j < len(lines) and lines[j] == "S":
                        j += 1

                i = j
                continue


            i += 1


# ---------------------------------------------------
# Create DataFrame
# ---------------------------------------------------

df = pd.DataFrame(records)

print("\n--------------------------------")
print("EXTRACTION COMPLETE")
print("--------------------------------")

print("Records extracted:", len(df))

print("\nFirst 20 records:\n")

print(df.head(20).to_string(index=False))


# ---------------------------------------------------
# Save test dataset
# ---------------------------------------------------

df.to_csv(
    "cutoffs_test.csv",
    index=False
)

print("\nSaved as: cutoffs_test.csv")