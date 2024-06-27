require("dotenv").config();
import { chromium, Browser, BrowserContext, Page } from "playwright";
import { test, expect } from "playwright/test";

const testCases = [
  {
    id: 1,
    name: "Test Case 1",
    leftNav: "Cross-functional project plan, Project",
    column: "To do",
    card_title: "Draft project brief",
  },
  {
    id: 2,
    name: "Test Case 2",
    leftNav: "Cross-functional project plan, Project",
    column: "To do",
    card_title: "Schedule kickoff meeting",
  },
  {
    id: 3,
    name: "Test Case 3",
    leftNav: "Cross-functional project plan, Project",
    column: "To do",
    card_title: "Share timeline with teammates",
  },
  {
    id: 4,
    name: "Test Case 4",
    leftNav: "Work Requests",
    column: "New Requests",
    card_title: "[Example] Laptop setup for new hire",
  },
  {
    id: 5,
    name: "Test Case 5",
    leftNav: "Work Requests",
    column: "In Progress",
    card_title: "[Example] Password not working",
  },
  {
    id: 6,
    name: "Test Case 6",
    leftNav: "Work Requests",
    column: "Completed",
    card_title: "[Example] New keycard for Daniela V",
  },
];

test.describe("Asana Data-Driven Tests", () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  // Loop through all test cases
  testCases.forEach((testCase) => {
    test(`Test Case: ${testCase.id}`, async () => {
      try {

        browser = await chromium.launch({ headless: false });
        context = await browser.newContext();
        page = await context.newPage();
        await page.goto(`${process.env.APP_URL}-/login`);

        await test.step("Login to Asana", async () => {
          try {
            console.log("Logging into Asana...");
            console.log("Entering email...");

            await page.waitForSelector('input[type="email"]', {
              timeout: 10000,
            });
            await page.fill('input[type="email"]', `${process.env.EMAIL}`);
            await page.press('input[type="email"]', "Enter");

            console.log("Entering password...");

            await page.waitForSelector('input[type="password"]', {
              timeout: 10000,
            });
            await page.fill(
              'input[type="password"]',
              `${process.env.PASSWORD}`,
            );
            await page.press('input[type="password"]', "Enter");

            console.log("Confirming login...");

            await page.waitForSelector("#topbar_search_input", {
              timeout: 10000,
            });
            const loggedInElement = await page.$("#topbar_search_input");
            const elementExists = loggedInElement !== null;

            expect(elementExists).toBe(true);
          } catch (error) {
            console.error("Error during login step:", error);
            throw error;
          }
        });

        await test.step("Navigate to the project page", async () => {
          try {
            console.log("Navigating to project page...");

            if (testCase.leftNav === "Cross-functional project plan, Project") {
              await page.goto(
                `${process.env.APP_URL}0/1205367008165973/1205366758273574`,
              );
            } else if (testCase.leftNav === "Work Requests") {
              await page.goto(
                `${process.env.APP_URL}0/1205367008167110/1205367578167113`,
              );
            }

            const inputElement = await page.waitForSelector(
              "input.ProjectPageHeaderProjectTitle-input",
              { timeout: 10000 },
            );
            const inputValue = await inputElement.evaluate(
              (element) => (element as HTMLInputElement).value,
            );
            expect(inputValue).toBe(testCase.leftNav);
          } catch (error) {
            console.error("Error during navigation step:", error);
            throw error;
          }
        });

        await test.step("Verify the card is within the right column", async () => {
          try {
            console.log("Verifying the card...");

            var isCorrectColumn = false;

            const cardText = testCase.card_title;
            const spanLocator = page.locator(
              `span.TypographyPresentation:has-text("${cardText}")`,
            );

            if (spanLocator) {
              await spanLocator.click();

              try {
                const spanSelector =
                  "span.TypographyPresentation.TypographyPresentation--overflowTruncate.TypographyPresentation--m.TypographyPresentation--fontWeightNormal";
                const spanElement = await page.waitForSelector(spanSelector, {
                  timeout: 10000,
                });
                if (spanElement) {
                  const projectsTextContext = await spanElement.textContent();
                  const expectedColumn = testCase.column;

                  if (projectsTextContext === expectedColumn) {
                    console.log(
                      `Found element with expected text: ${expectedColumn}`,
                    );
                    // Happy path:
                    isCorrectColumn = true; 
                  } else {
                    console.log(
                      `Element found but text doesn't match. Expected: ${expectedColumn}, Found: ${projectsTextContext}`,
                    );
                  }
                } else {
                  console.log(
                    `Element not found with selector: ${spanSelector}`,
                  );
                }
              } catch (error) {
                console.error("Error occurred during verification:", error);
              }
            } else {
              console.log(`Element found but text doesn't match: ${cardText}`);
            }
          } catch (error) {
            console.error("Error during verification step:", error);
            throw error;
          }

          expect(isCorrectColumn).toBe(true);
        });
      } catch (error) {
        console.error("Test case failed:", error);
        throw error;
      } finally {
        if (browser) {
          await browser.close();
        }
      }
    });
  });
});
