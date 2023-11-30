const dotenv = require("dotenv");
const { Client } = require("@notionhq/client");

dotenv.config();

const { NOTION_API_KEY, DATABASEID, SEARCHKEY } = process.env;

const notion = new Client({ auth: NOTION_API_KEY });

async function retrievePages() {
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

async function childrenList(id) {
  try {
    const response = await notion.blocks.children.list({
      block_id: id,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

async function mainAppending(pageId, blockId) {
  try {
    let mainBlockId = await appendBlocks(pageId, blockId, [
      {
        heading_3: {
          rich_text: [
            {
              text: {
                content: "Publishing the project with the student",
              },
            },
          ],
          is_toggleable: true,
          color: "yellow_background",
        },
      },
    ]);
    sleep(300);
    let nextMainBlockId = await appendBlocks(mainBlockId, undefined, [
      {
        paragraph: {
          rich_text: [
            {
              text: {
                content:
                  "Please note that it is important to publish the project with the student in the iSchool System!",
              },
            },
          ],
        },
      },
      {
        heading_3: {
          rich_text: [
            {
              text: {
                content: "Steps for the students",
              },
            },
          ],
          is_toggleable: true,
        },
      },
    ]);
    sleep(300);
    let nextBlockId = await appendBlocks(nextMainBlockId, undefined, [
      {
        numbered_list_item: {
          rich_text: [
            {
              text: {
                content: "Log in to the Dashboard",
              },
            },
          ],
        },
      },
    ]);
    sleep(300);
    nextBlockId = await appendBlocks(nextBlockId, undefined, [
      {
        paragraph: {
          rich_text: [
            {
              text: {
                content:
                  "Students can log in to their dashboard easily with the username and password given to them.",
              },
            },
          ],
        },
      },
      {
        image: {
          external: {
            url: "https://i.ibb.co/qyGwVHG/1png.png",
          },
        },
      },
    ]);
    sleep(300);
    nextBlockId = await appendBlocks(nextMainBlockId, undefined, [
      {
        numbered_list_item: {
          rich_text: [
            {
              text: {
                content: "Choose Projects",
              },
            },
          ],
        },
      },
    ]);
    sleep(300);
    nextBlockId = await appendBlocks(nextBlockId, undefined, [
      {
        paragraph: {
          rich_text: [
            {
              text: {
                content:
                  "From your Dashboard, you will find multiple tabs, select the Projects tab and it will transfer you to your projects",
              },
            },
          ],
        },
      },
      {
        image: {
          external: {
            url: "https://i.ibb.co/gFv79cN/2.png",
          },
        },
      },
      {
        paragraph: {
          rich_text: [
            {
              text: { content: "" },
            },
          ],
        },
      },
    ]);
    sleep(300);
    nextBlockId = await appendBlocks(nextMainBlockId, undefined, [
      {
        numbered_list_item: {
          rich_text: [
            {
              text: {
                content: "Add new Project",
              },
            },
          ],
        },
      },
    ]);
    sleep(300);
    nextBlockId = await appendBlocks(nextBlockId, undefined, [
      {
        paragraph: {
          rich_text: [
            {
              text: {
                content:
                  "In this tab, you will find your projects, and if you have not uploaded any projects before, you can choose to add a project and add your first one.",
              },
            },
          ],
        },
      },
      {
        image: {
          external: {
            url: "https://i.ibb.co/kHdSs0v/3.png",
          },
        },
      },
      {
        paragraph: {
          rich_text: [
            {
              text: { content: "" },
            },
          ],
        },
      },
    ]);
    sleep(300);
    nextBlockId = await appendBlocks(nextMainBlockId, undefined, [
      {
        numbered_list_item: {
          rich_text: [
            {
              text: {
                content: "Fill the needed data",
              },
            },
          ],
        },
      },
    ]);
    sleep(300);
    nextBlockId = await appendBlocks(nextBlockId, undefined, [
      {
        paragraph: {
          rich_text: [
            {
              text: {
                content:
                  "To add any projects you will need to fill in the following :",
              },
            },
          ],
        },
      },
      {
        image: {
          external: {
            url: "https://i.ibb.co/6P5X2dL/4.png",
          },
        },
      },
      {
        numbered_list_item: {
          rich_text: [
            {
              text: {
                content:
                  "Category: you will need to choose your current Category/course/ level from the list",
              },
            },
          ],
        },
      },
      {
        numbered_list_item: {
          rich_text: [
            {
              text: {
                content: "Project title: Your project’s title/name",
              },
            },
          ],
        },
      },
      {
        numbered_list_item: {
          rich_text: [
            {
              text: {
                content:
                  "Description: Here you can add what is your project, what it can do, how you built it, and all the details you want to add",
              },
            },
          ],
        },
      },
      {
        numbered_list_item: {
          rich_text: [
            {
              text: {
                content:
                  "Project URL: Here you can add your project’s link/URL, like the link on mBlock, or any online platform, Google Drive or OneDrive link",
              },
            },
          ],
        },
      },
      {
        numbered_list_item: {
          rich_text: [
            {
              text: {
                content:
                  "Cover image: Here you can take a screenshot from the project or you can upload any image that represents the project",
              },
            },
          ],
        },
      },
      {
        numbered_list_item: {
          rich_text: [
            {
              text: {
                content:
                  "After you finish all this you can click on submit to save the project",
              },
            },
          ],
        },
      },
    ]);
    sleep(300);
    nextBlockId = await appendBlocks(nextMainBlockId, undefined, [
      {
        numbered_list_item: {
          rich_text: [
            {
              text: {
                content: "Review Your Project",
              },
            },
          ],
        },
      },
    ]);
    sleep(300);
    nextBlockId = await appendBlocks(nextBlockId, undefined, [
      {
        paragraph: {
          rich_text: [
            {
              text: {
                content:
                  "You can review all your uploaded projects from this tab, as it works like a project gallery, also you can edit any old projects if you have new updates on them, click on the edit icon in the left corner of the project.",
              },
            },
          ],
        },
      },
      {
        image: {
          external: {
            url: "https://i.ibb.co/ZTTfwRV/5.png",
          },
        },
      },
    ]);
    sleep(300);
    nextBlockId = await appendBlocks(nextMainBlockId, undefined, [
      {
        numbered_list_item: {
          rich_text: [
            {
              text: {
                content: "Edit or delete the project",
              },
            },
          ],
        },
      },
    ]);
    sleep(300);
    nextBlockId = await appendBlocks(nextBlockId, undefined, [
      {
        paragraph: {
          rich_text: [
            {
              text: {
                content:
                  "After you click on edit you can edit any field you need, or if you want to delete the project and upload a new one you can do so.",
              },
            },
          ],
        },
      },
      {
        image: {
          external: {
            url: "https://i.ibb.co/WBxpccL/6.png",
          },
        },
      },
      {
        image: {
          external: {
            url: "https://i.ibb.co/z6scQBM/7.png",
          },
        },
      },
    ]);
  } catch (error) {
    console.error("Error appending blocks:", error);
  }
}

async function appendBlocks(pageId, blockId, blocks) {
  try {
    let response = await notion.blocks.children.append({
      block_id: pageId,
      after: blockId,
      children: blocks,
    });
    response = response.results;
    const lastItem = response[blocks.length - 1];
    console.log(response);
    return lastItem.id;
  } catch (error) {
    console.error("Error appending block above:", error);
  }
}

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

async function main() {
  const resPages = await retrievePages();
  resPages.length // Check if there are pages to append into
    ? resPages.forEach(async (page) => {
        let response = await childrenList(page.id);

        response = response.results;
        response.forEach(async (block) => {
          if (block.type == "heading_3" && block.heading_3.is_toggleable) {
            const blockContent = block.heading_3.rich_text[0].plain_text;
            if (blockContent == "(Share) Presentation and Tasks (5 mins)") {
              mainAppending(page.id, block.id);
            }
          }
        });
      })
    : console.log("No pages found.");
}

main();
