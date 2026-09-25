import { db } from "../db/db.js";
import { leads } from "../db/schema.js";

const getAllLeads = async (req, res) => {
    try {
        const allLeads = await db.select().from(leads);
        res.status(200).json({
            status: 200,
            message: "Leads fetched successfully",
            data: allLeads
        });
    } catch (error) {
        console.error("Error fetching leads:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const  createLead = async (req, res) => {
    const { name, email, phone } = req.body;

    try {
        const newLead = await db.insert(leads).values({
            name,
            email,
            phone,
            status: 'New'
        }).returning();

        res.status(201).json({
            status: 201,
            message: "Lead created successfully",
            data: newLead
        });
    } catch (error) {
        console.error("Error creating lead:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export { getAllLeads, createLead };