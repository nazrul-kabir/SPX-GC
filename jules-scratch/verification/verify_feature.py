import re
from playwright.sync_api import Page, expect

def run(page: Page):
    # Go to http://localhost:5656/config
    page.goto("http://localhost:5656/config")

    # Wait for the page to be fully loaded
    page.wait_for_load_state("networkidle")

    # Expect a title "to contain" a substring.
    expect(page).to_have_title(re.compile("SPX-GC"))

    # Find the "Generate All Thumbnails" button and assert it is visible.
    generate_all_button = page.get_by_role("button", name="Generate All Thumbnails")
    expect(generate_all_button).to_be_visible()

    # Find the BUMPER template row.
    bumper_template_row = page.locator("tr", has_text="BUMPER")

    # Find the "Generate" button within the BUMPER template row and assert it is visible.
    generate_button = bumper_template_row.get_by_role("button", name="Generate")
    expect(generate_button).to_be_visible()

    # Take a screenshot.
    page.screenshot(path="jules-scratch/verification/screenshot.png")