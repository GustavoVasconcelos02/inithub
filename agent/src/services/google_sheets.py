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

    titles = ["Modelo", "Usuário", "Agente", "Contextos", "Criado em"]
    sheet.update("A1:E1", [titles])
    sheet.format("A1:E1", {"textFormat": {"bold": True}})

    sheet.freeze(rows=1)

    sheet.format("B:B", {"wrapStrategy": "WRAP"})
    sheet.format("C:C", {"wrapStrategy": "WRAP"})
    sheet.format("D:D", {"wrapStrategy": "WRAP"})

    sheet.format(
        "A2:E1000",
        {
            "backgroundColorStyle": {
                "rgbColor": {"red": 0.98, "green": 0.98, "blue": 0.98}
            }
        },
    )

    return sheet


def add_test_case(sheet: gspread.Worksheet, test_case: TestCase):
    sheet.append_row(
        [
            test_case["model"],
            test_case["user_input"],
            test_case["response"],
            str(test_case["retrieved_contexts"]),
            test_case["created_at"],
        ]
    )
