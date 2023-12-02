const { Client } = require("@notionhq/client");
const dotenv = require("dotenv");
dotenv.config();

// Initialize the Notion client with your API token
const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function removeAllBlocks(blocks) {
  try {
    for (const block of blocks) {
      console.log(block);
      if (block.id) {
        await notion.blocks.delete({ block_id: block.id });
      }
    }

    console.log("All blocks removed successfully.");
  } catch (error) {
    console.error("Error removing blocks:", error);
  }
}

async function getAllChildrenBlocks(id) {
  try {
    const response = await notion.blocks.children.list({
      block_id: id,
    });

    const children = response.results;

    let allBlocks = [];

    // Accumulate the children
    allBlocks = allBlocks.concat(children);

    // Recursively fetch more children if available
    for (const child of children) {
      if (child.has_children) {
        const childBlocks = await getAllChildrenBlocks(child.id);
        allBlocks = allBlocks.concat(childBlocks);
      }
    }

    return allBlocks;
  } catch (error) {
    console.error("Error fetching children blocks:", error);
    throw error; // Rethrow the error to handle it outside the function
  }
}

// Function to append a new block above a specific block
async function appendBlockAbove(pageId, blockId) {
  try {
    // Retrieve the children blocks of the page
    getAllChildrenBlocks(pageId)
      .then((allBlocks) => {
        console.log("All Blocks:", allBlocks);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // const blocks = response.results;

    // // Create a new block
    const newBlock = {
      //   heading_3: {
      //     rich_text: [
      //       { text: { content: "Publishing the project with the student" } },
      //     ],
      //     is_toggleable: true,
      //     color: "yellow_background",
      //   },
      // };
      heading_3: {
        rich_text: [
          { text: { content: "Publishing the project with the student " } },
        ],
        is_toggleable: true,
        color: "yellow_background",
        children: [
          {
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
            column_list: {
              children: [
                {
                  column: {
                    children: [
                      {
                        paragraph: {
                          rich_text: [
                            { type: "text", text: { content: "paragraph2" } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  column: {
                    children: [
                      {
                        image: {
                          external: {
                            url: "https://i.ibb.co/VgDCz6Q/image.png",
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    };

    // // Find the index of the target block above which you want to append the new block
    // const indexOfTargetBlock = blocks.findIndex(
    //   (block) =>
    //     block.type === "heading_1" &&
    //     block.heading_1.rich_text[0].plain_text === "Glossaries"
    // );

    // // Insert the new block above the target block
    // blocks.splice(indexOfTargetBlock, 0, newBlock);

    // await removeAllBlocks(blocks);

    // // Update the page with the modified content
    // await notion.blocks.children.append({
    //   block_id: pageId,
    //   children: blocks,
    // });
    console.log("Block appended above successfully.");
  } catch (error) {
    console.error("Error appending block above:", error);
  }
}

// Replace 'YOUR_NOTION_API_TOKEN', 'YOUR_PAGE_ID', and 'TARGET_BLOCK_ID' with your Notion API token, page ID, and the ID of the target block

const YOUR_PAGE_ID = "064648df5bbd490a95046a554f138939";
const TARGET_BLOCK_ID = "f66be01730984c5294e8c11d3bab075d";

// Replace 'Your new content' with the content you want to append
appendBlockAbove(YOUR_PAGE_ID, TARGET_BLOCK_ID);
