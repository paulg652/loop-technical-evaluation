### Iteration: 1.0.1

### Overview ###

The client requested a fast way to test card column accuracy for their projects in Asana.

The automated tests were done in a Chromium browser, with TypeScript Playwright, an efficient framework for browser testing and automation.

STEPS TAKEN:
1. Login to Asana using client credentials for each card accuracy test.
2. Navigate to relevant project using the UI for each card accuracy test.
3. Ensure that project card exists under the correct column. 

EXAMPLE:
Card X in project Y must be present in column Z.

*client email and password was protected by being hidden in environment variables 

### Findings ###

PASS: 66.66 %
FAIL: 33.33 %

FAILURES:
Test case 3:
Card "Share timeline with teammates" was not present in column "To do" within project "Cross-functional project plan, Project"

Test case 4:
Card "[Example] Laptop setup for new hire" was not present in column "New Requests" within project "Work Requests".

### Blockers ###

Limited blockers were encountered. The Asana page offered useful information in its UI to complete each task. Example: the exact columns for project cards could be easily be identified by finding the card and viewing its "Projects" details. No API calls were needed during this process.

### Solutions ###

For future testing, we recommend logging into Asana is only required once. The current version of the test automation opens Chromium, logs in with client credentials, and closes the browser after each test case. We predict that opening and closing the browser only once would save a significant amount of time, and the present state does not add value to the goal at hand, which is to ensure the accuracy of card columns.

To address the problem of 33.33% failure rate, we recommend establishing more strict policy governing card placement on project boards, ensuring each member of the team places their cards in the correct position by the end of each work day.