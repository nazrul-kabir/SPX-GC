from playwright.sync_api import sync_playwright, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # 1. Navigate to the SPX-GC homepage.
        page.goto("http://localhost:5656/")

        # 2. Go to the "Shows" page.
        page.locator('a[href="/shows"]').click()
        expect(page).to_have_url("http://localhost:5656/shows")

        # 3. Click on the "Default" show.
        page.locator('a[href="/show/Default"]').click()
        expect(page).to_have_url("http://localhost:5656/show/Default")

        # 4. Go to the show's configuration page.
        page.locator('a[href="/show/Default/config"]').click()
        expect(page).to_have_url("http://localhost:5656/show/Default/config")

        # 5. Click on the "Templates" tab.
        page.locator('button:has-text("Templates")').click()

        # 6. Find the BUMPER.html template row and trigger thumbnail generation.
        bumper_row = page.locator('tr:has-text("BUMPER.html")')
        expect(bumper_row).to_be_visible()

        generate_button = bumper_row.locator('button:has-text("Create")')
        expect(generate_button).to_be_visible()
        generate_button.click()

        # 7. Wait for the success notification.
        success_notification = page.locator(".happyMsg")
        expect(success_notification).to_be_visible(timeout=20000)
        expect(success_notification).to_contain_text("Thumbnail created", timeout=10000)

        # 8. Reload the page to ensure the thumbnail is displayed.
        page.reload()

        # 9. Verify that the thumbnail image is now present.
        bumper_row = page.locator('tr:has-text("BUMPER.html")')
        thumbnail_image = bumper_row.locator('img[src*="thumbnail.png"]')
        expect(thumbnail_image).to_be_visible()

        # 10. Take a screenshot for visual confirmation.
        page.screenshot(path="jules-scratch/verification/verification.png")
        print("Screenshot of generated thumbnail taken successfully.")

    except Exception as e:
        print(f"An error occurred during verification: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")

    finally:
        browser.close()

if __name__ == "__main__":
    with sync_playwright() as p:
        run(p)