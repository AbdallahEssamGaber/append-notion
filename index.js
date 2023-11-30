const dotenv = require("dotenv");
const { Client } = require("@notionhq/client");
const { resolveNaptr } = require("dns");

dotenv.config();

const { NOTION_API_KEY, DATABASEID, SEARCHKEY, TOGGLECONTENT, INSIDECONTENT } =
  process.env;

const notion = new Client({ auth: NOTION_API_KEY });

const toggleBlock = [
  {
    heading_3: {
      rich_text: [
        {
          type: "text",
          text: {
            content: "Publishing the project with the student ",
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
                  content:
                    "Please note that it is important to publish the project with the student in the iSchool System!",
                },
              },
            ],
          },
        },
      ],
    },
  },
];

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

async function findBlockId(properties) {
  try {
  } catch (error) {
    console.error(error);
  }
}

async function append(pageId, res) {
  try {
    const response = await notion.blocks.children.append({
      block_id: pageId,
      children: res,
      //   [
      //     {
      //       heading_3: {
      //         rich_text: [
      //           {
      //             type: "text",
      //             text: {
      //               content: TOGGLECONTENT,
      //             },
      //           },
      //         ],
      //         is_toggleable: true,
      //         children: [
      //           {
      //             type: "paragraph",
      //             paragraph: {
      //               rich_text: [
      //                 {
      //                   type: "text",
      //                   text: {
      //                     content: INSIDECONTENT,
      //                   },
      //                 },
      //               ],
      //             },
      //           },
      //         ],
      //       },
      //     },
      //   ],
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

async function deleteBlock(id) {
  try {
    const v = await notion.blocks.delete({
      block_id: id,
    });
    console.log(v);
  } catch (error) {
    console.error(error);
  }
}

async function childrenList(id) {
  try {
    const d = await notion.blocks.children.list({
      block_id: id,
    });
    return d;
  } catch (error) {
    console.error(error);
  }
}

async function main() {
  const blocks = [];
  const resPages = await reterivePages();
  resPages.length // Check if there are pages to append into
    ? resPages.forEach(async (page) => {
        let response = await childrenList(page.id);

        response = response.results;
        let removeToggle = false;
        response.forEach(async (block, index) => {
          if (block.type == "heading_1") {
            let blockContent = block.heading_1.rich_text[0].plain_text;
            if (blockContent == "Groceries") {
              removeToggle = true;
            }
          }

          if (removeToggle) {
            blocks.push(block);
            await deleteBlock(block.id);
          }
        });
        // remove only the below pending
        await sleep(300);
        await append(page.id, [toggleBlock]);
        await sleep(900);
        await append(page.id, blocks);
        await sleep(300);
      })
    : console.log("No pages found.");
  //   await reterivePages().then(async function (resPages) {});
}

main();
