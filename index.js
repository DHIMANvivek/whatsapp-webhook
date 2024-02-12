<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Create Template</title>
  </head>
  <body>
    <h1>Create Template</h1>
    <form id="templateForm">
      <label for="templateName">Template Name:</label>
      <input type="text" id="templateName" name="templateName" required />
      <button type="submit" id="createTemplateBtn">Create Template</button>
    </form>

    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script>
      // Function to handle form submission
      document
        .getElementById("templateForm")
        .addEventListener("submit", function (event) {
          event.preventDefault(); // Prevent default form submission

          // Get the template name from the input field
          const templateName = document.getElementById("templateName").value;

          // Call the createTemplate function with the entered template name
          createTemplate(templateName);
        });

      // Function to create the template
      function createTemplate(templateName) {
        // Template data
        const templateData = {
          "name": templateName,
          "language": "en",
          "category": "MARKETING",
          "components": [
            {
              "type": "HEADER",
              "format": "TEXT",
              "text": "Our {{1}} is on!",
              "example": {
                "header_text": ["Summer Sale"],
              },
            },
            {
              "type": "BODY",
              "text": "Shop now through",
            },
            {
              "type": "FOOTER",
              "text": "Use the buttons below to manage your marketing subscriptions",
            },
            {
              "type": "BUTTONS",
              "buttons": [
                {
                  "type": "QUICK_REPLY",
                  "text": "Unsubcribe ",
                },
                {
                  "type": "QUICK_REPLY",
                  "text": "Unsubscribe from All",
                },
              ],
            },
          ],
        };

        // Make POST request to create the template
        axios
          .post(
            "https://graph.facebook.com/v18.0/180046158536495/message_templates",
            templateData,
            {
              params: {
                access_token:
                  "EAAURI1ZBPiYgBO26b3qloDhvIrbHV8dKWHhwl4GCXvPpENRV4mTQ1UAkYJywbt71qXDKBHqRxNXQNZBtCaGXzML3tDHptlA5xiwyyUG7oauyKSCV668hYv64aUIRZCzi8CU04bcZCKqhJvJuzJZAr4s0KZA4bS2jxpYvhrqYAPeZAeEjlY4dCw4Jvpoz3dse0fODlK0M2FQMNaT70C1YSa0xLiHfm6ZC7UQbe2JZB91fD0JYZD",
              },
            }
          )

          .then((response) => {
            console.log("Template created successfully:", response.data);
            // Optionally, do something after template creation
          })
          .catch((error) => {
            console.error(
              "Error creating template:",
              error.response.data.error
            );
            // Handle error
          });
      }
    </script>
  </body>
</html>
