import {RefinementCtx, z, ZodError} from "zod";

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

    it('should support data conversion', async () => {

        const usernameSchema = z.coerce.string().min(3).max(100);
        const isAdminSchema = z.coerce.boolean();
        const priceSchema = z.coerce.number().min(1000).max(1000000);

        const username = usernameSchema.parse(12345);
        console.info(username);

        const isAdmin = isAdminSchema.parse("true");
        console.info(isAdmin);

        const price = priceSchema.parse("10000");
        console.info(price);

    });

    it('should support date validation', async () => {

        const birthDateSchema = z.coerce.date().min(new Date(1980, 0, 1)).max(new Date(2020, 0, 1));

        const birthDate = birthDateSchema.parse("1990-01-01");
        console.info(birthDate);

        const birthDate2 = birthDateSchema.parse(new Date(1990, 0, 1));
        console.info(birthDate2);

    });

    it('should return zod error if invalid', async () => {

        const schema = z.string().email().min(3).max(100);

        try {
            schema.parse("ek");
        } catch (err) {
            if (err instanceof ZodError) {
                console.error(err);
                // err.errors.forEach((error) => {
                //     console.info(error.message);
                // })
            }
        }

    });

    it('should return zod error if invalid without exception', async () => {

        const schema = z.string().email().min(3).max(100);

        const result = schema.safeParse("eko@example.com");

        if (result.success) {
            console.info(result.data);
        } else {
            console.error(result.error);
        }

    });

    it('should can validate object', async () => {

        const loginSchema = z.object({
            username: z.string().email(),
            password: z.string().min(6).max(20)
        });

        const request = {
            username: "eko@test.com",
            password: "rahasia",
            ignore: "ignore",
            name: "Eko Kurniawan"
        };

        const result = loginSchema.parse(request);
        console.info(result);

    });

    it('should support nested object', async () => {

        const createUserSchema = z.object({
            id: z.string().max(100),
            name: z.string().max(100),
            address: z.object({
                street: z.string().max(100),
                city: z.string().max(100),
                zip: z.string().max(10),
                country: z.string().max(100),
            })
        })

        const request = {
            id: "123",
            name: "Eko",
            address: {
                street: "Jalan Belum Jadi",
                city: "Jakarta",
                zip: "12323",
                country: "Indonesia"
            }
        };

        const result = createUserSchema.parse(request);
        console.info(result);

    });

    it('should support array validation', async () => {

        const schema = z.array(
            z.string().email()
        ).min(1).max(10);

        const request: Array<string> = ["eko@example.com", "budi@example.com"];
        const result: Array<string> = schema.parse(request);

        console.info(result);

    });

    it('should support set validation', async () => {

        const schema = z.set(
            z.string().email()
        ).min(1).max(10);

        const request: Set<string> = new Set(["eko@example.com", "budi@example.com", "eko@example.com"]);
        const result: Set<string> = schema.parse(request);

        console.info(result);

    });

    it('should support map validation', async () => {

        const schema = z.map(
            z.string(),
            z.string().email()
        );

        const request: Map<string, string> = new Map([
            ["eko", "eko@example.com"],
            ["budi", "budi@example.com"],
        ]);
        const result: Map<string, string> = schema.parse(request);
        console.info(result);

    });

    it('should can validate object with message', async () => {

        const loginSchema = z.object({
            username: z.string().email("username harus email"),
            password: z.string().min(6, "password min harus 6 karakter").max(20, "password max harus 20 karakter")
        });

        const request = {
            username: "eko",
            password: "12",
        };

        try {
            const result = loginSchema.parse(request);
            console.info(result);
        } catch (err) {
            console.error(err);
        }

    });

    it('should can support optional validation', async () => {

        const registerSchema = z.object({
            username: z.string().email(),
            password: z.string().min(6).max(20),
            firstName: z.string().min(3).max(100),
            lastName: z.string().min(3).max(100).optional(),
        })

        const request = {
            username: "eko@example.com",
            password: "rahasia",
            firstName: "Eko",
        }

        const result = registerSchema.parse(request);
        console.info(result);

    });

    it('should support transform', async () => {

        const schema = z.string().transform((data) => {
            return data.toUpperCase().trim();
        });

        const result = schema.parse("     khannedy     ");
        console.info(result);

    });

    function mustUpperCase(data: string, ctx: RefinementCtx): string {
        if (data != data.toUpperCase()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "username harus uppercase"
            })
            return z.NEVER;
        } else {
            return data;
        }
    }

    it('should can use custom validation', async () => {

        const loginSchema = z.object({
            username: z.string().email().transform(mustUpperCase),
            password: z.string().min(6).max(20)
        });

        const request = {
            username: "EKO@EXAMPLE.COM",
            password: "rahasia"
        };
        const result = loginSchema.parse(request);
        console.info(result);

    });

});
