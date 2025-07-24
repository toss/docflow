export function createDocflowConfig(): string {
  return `
module.exports = {
  project: {
    root: ".",
    packageManager: "yarn",
    workspace: {
      include: ["packages/*"],
      exclude: [],
    },
  },
  commands: {
    generate: {
      jsdoc: {
        fetcher: async ({ signature, prompt }) => {
          // Mock fetcher for testing
          const functionName = signature.split(" ")[1].split("(")[0];
          
          const mockResponses = {
            fetchData: \`/**
 * @public
 * @kind function
 * @category index
 * @name fetchData
 * @signature
 * \\\`\\\`\\\`typescript
 * function fetchData(url: string): Promise<unknown>
 * \\\`\\\`\\\`
 * @description
 * Fetches data from the given URL. This function makes an API call to retrieve JSON data.
 * @param {string} url The URL to fetch data from
 * @returns {Promise<unknown>} A Promise containing the fetched data
 * @example
 * \\\`\\\`\\\`typescript
 * import { fetchData } from '@libs/core';
 * 
 * const data = await fetchData('https://api.example.com/data');
 * console.log(data);
 * \\\`\\\`\\\`
 * @version [1.0.0] Initial version
 */\`,
            calculateArea: \`/**
 * @public
 * @kind function
 * @category index
 * @name calculateArea
 * @signature
 * \\\`\\\`\\\`typescript
 * function calculateArea(radius: number): number
 * \\\`\\\`\\\`
 * @description
 * Calculates the area of a circle using the given radius.
 * @param {number} radius The radius of the circle. Must be a positive number.
 * @returns {number} The area of the circle.
 * @example
 * \\\`\\\`\\\`typescript
 * import { calculateArea } from '@libs/math';
 * 
 * const area = calculateArea(5);
 * console.log(area); // 78.53981633974483
 * \\\`\\\`\\\`
 * @version [1.0.0] Initial version
 */\`,
            calculateVolume: \`/**
 * @public
 * @kind function
 * @category index
 * @name calculateVolume
 * @signature
 * \\\`\\\`\\\`typescript
 * function calculateVolume(radius: number, height: number): number
 * \\\`\\\`\\\`
 * @description
 * Calculates the volume of a cylinder using the given radius and height.
 * @param {number} radius The radius of the cylinder
 * @param {number} height The height of the cylinder
 * @returns {number} The volume of the cylinder
 * @example
 * \\\`\\\`\\\`typescript
 * import { calculateVolume } from '@libs/math';
 * 
 * const volume = calculateVolume(5, 10);
 * console.log(volume); // 785.3981633974483
 * \\\`\\\`\\\`
 * @version [1.0.0] Initial version
 */\`
          };
          
          return mockResponses[functionName] || "";
        },
        prompt: "Generate JSDoc for test"
      }
    },
    build: {
      manifest: {
        prefix: "/references",
        enabled: true,
        path: "docs/references/manifest.json",
      },
      outputDir: "docs/references",
      generator: {
        name: "vitepress",
        signatureLanguage: "typescript",
      },
    },
    check: {},
  },
  plugins: [],
};
`;
}
