import {z} from "zod";

describe('zod', () => {

    it('should support validation', async () => {

        const schema = z.string().min(3).max(100);

        const request = "eko";
        const result = schema.parse(request);

        expect(result).toBe("eko");

    });

    it('should support validate primitive data type', async () => {

        const usernameSchema = z.string().email();
        const isAdminSchema = z.boolean();
        const priceSchema = z.number().min(1000).max(1000000);

        const username = usernameSchema.parse("eko@example.com");
        console.info(username);

        const isAdmin = isAdminSchema.parse(true);
        console.info(isAdmin);

        const price = priceSchema.parse(10000);
        console.info(price);

    });

});
