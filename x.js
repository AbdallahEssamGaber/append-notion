const { Client } = require("@notionhq/client");
const dotenv = require("dotenv");
dotenv.config();

// Initialize the Notion client with your API token
const notion = new Client({ auth: process.env.NOTION_API_KEY });

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
      console.log(child);
      if (child.has_children) {
        const childBlocks = await getAllChildrenBlocks(child.id);
        const lastElemIndex = allBlocks.length - 1;
        const lastElemProp =
          allBlocks[Object.keys(allBlocks)[Object.keys(allBlocks).length - 1]];
        const l =
          lastElemProp[
            Object.keys(lastElemProp)[Object.keys(lastElemProp).length - 1]
          ];
        l["children"] = childBlocks;
        // console.log(l);
        // allBlocks = allBlocks.concat(childBlocks);
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
    const s = await notion.blocks.children.append({
      block_id: pageId,
      children: [
        {
          heading_3: {
            rich_text: [
              { text: { content: "Publishing the project with the student" } },
            ],
            is_toggleable: true,
            color: "yellow_background",
          },
        },
      ],
    });
    console.log(s);
    // // Retrieve the children blocks of the page
    // // const response = await notion.blocks.children.list({ block_id: pageId });
    // // const blocks = response.results;
    // // blocks.forEach((element) => {
    // //   console.log(element);
    // // });
    // getAllChildrenBlocks(pageId)
    //   .then(async (allBlocks) => {
    //     // console.log("All Blocks:", allBlocks);
    //     const response = await notion.blocks.children.append({
    //       block_id: pageId,
    //       children: allBlocks,
    //     });
    //     // console.log(response);
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //   });
    // console.log("Block appended above successfully.");
  } catch (error) {
    console.error("Error appending block above:", error);
  }
}

// Replace 'YOUR_NOTION_API_TOKEN', 'YOUR_PAGE_ID', and 'TARGET_BLOCK_ID' with your Notion API token, page ID, and the ID of the target block

const YOUR_PAGE_ID = "b304a9d5cf1c4047b5b23d09977fea58";
// const TARGET_BLOCK_ID = "bb4944a10c374473b33169aab63bb2e7";

// Replace 'Your new content' with the content you want to append
appendBlockAbove(YOUR_PAGE_ID);
