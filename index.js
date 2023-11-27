const dotenv = require("dotenv");
const { Client } = require("@notionhq/client");

dotenv.config();

const { NOTION_API_KEY, DATABASEID, SEARCHKEY, TOGGLECONTENT, INSIDECONTENT } =
  process.env;

const notion = new Client({ auth: NOTION_API_KEY });

async function reterivePages() {
  try {
    const response = await notion.databases.query({
      database_id: DATABASEID,
      filter: {
        property: "Name",
        rich_text: {
          contains: SEARCHKEY,
        },
      },
    });
    return response.results;
  } catch (error) {
    console.error(error);
  }
}

async function append(pageId) {
  try {
    const response = await notion.blocks.children.append({
      block_id: pageId,
      children: [
        {
          heading_3: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: TOGGLECONTENT,
                },
              },
            ],
            is_toggleable: true,
            children: [
              {
                type: "paragraph",
                paragraph: {
                  rich_text: [
                    {
                      type: "text",
                      text: {
                        content: INSIDECONTENT,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

async function main() {
  await reterivePages().then(async function (resPages) {
    resPages.length // Check if there are pages to append into
      ? resPages.forEach((page) => append(page.id))
      : console.log("No pages found.");
  });
}

main();
