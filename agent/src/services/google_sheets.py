from src.config import env
from src.schemas.agent import TestCase

import gspread
from google.oauth2.service_account import Credentials


scopes = ["https://www.googleapis.com/auth/spreadsheets"]
creds = Credentials.from_service_account_file("credentials.json", scopes=scopes)
client = gspread.authorize(creds)

sheet_id = env.GOOGLE_SHEET_ID
workbook = client.open_by_key(sheet_id)


def get_test_cases_sheet():
    worksheet_list = map(lambda x: x.title, workbook.worksheets())

    new_worksheet_name = "Test cases"

    if new_worksheet_name in worksheet_list:
        sheet = workbook.worksheet(new_worksheet_name)
    else:
        sheet = workbook.add_worksheet(new_worksheet_name, rows=10, cols=10)

    titles = [
        "Modelo",
        "User ID",
        "Session ID",
        "Criado em",
        "Usuário",
        "Agente",
        "Contextos",
    ]

    sheet.update("A1:G1", [titles])
    sheet.format("A1:G1", {"textFormat": {"bold": True}})

    sheet.freeze(rows=1)

    _apply_text_wrap(sheet, ["A:A", "B:B", "C:C", "D:D", "E:E", "F:F", "G:G"])

    sheet.format(
        "A1:G1000",
        {
            "verticalAlignment": "TOP",
            "backgroundColorStyle": {
                "rgbColor": {"red": 0.98, "green": 0.98, "blue": 0.98}
            },
        },
    )

    return sheet


def _apply_text_wrap(sheet: gspread.Worksheet, list_col_range: list[str]):
    for col_range in list_col_range:
        sheet.format(col_range, {"wrapStrategy": "WRAP"})


def add_test_case(sheet: gspread.Worksheet, test_case: TestCase):
    sheet.append_row(
        [
            test_case.get("model") or "unknown-model",
            test_case.get("user_id") or "",
            test_case.get("session_id") or "",
            test_case.get("created_at") or "",
            test_case.get("user_input") or "",
            test_case.get("response") or "",
            str(test_case.get("retrieved_contexts") or []),
        ]
    )
