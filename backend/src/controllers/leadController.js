import { db } from "../db/db.js";
import { leads } from "../db/schema.js";
import { ilike, or, count, eq } from 'drizzle-orm';

const getAllLeads = async (req, res) => {
    const { search, page, pageSize } = req.query;
    const pageNum = Number(page) || 1;
    const pageSizeNum = Number(pageSize) || 10;

    try {
        let allLeads;
        let totalCountQuery;

        if (search) {
            const searchTerm = `%${search.trim()}%`;
            const condition = or(ilike(leads.name, searchTerm), ilike(leads.email, searchTerm));

            allLeads = await db.select().from(leads).where(condition).limit(pageSizeNum).offset((pageNum - 1) * pageSizeNum);
            totalCountQuery = await db.select({ count: count() }).from(leads).where(condition);
        } else {
            allLeads = await db.select().from(leads).limit(pageSizeNum).offset((pageNum - 1) * pageSizeNum);
            totalCountQuery = await db.select({ count: count() }).from(leads);
        }

        const total = totalCountQuery[0].count;
        const totalPages = Math.ceil(total / pageSizeNum);

        if (pageNum > totalPages) {
            return res.status(404).json({
                status: 404,
                message: "Page number should be less than or equal to Total pages",
                data: null
            })
        }

        res.status(200).json({
            status: 200,
            message: "Leads fetched successfully",
            data: allLeads,
            pagination: {
                page: pageNum,
                size: pageSizeNum,
                totalPages,
            },
        });
    } catch (error) {
        console.error("Error fetching leads:", error);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
};

const createLead = async (req, res) => {
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

const updateLeadStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const leadExists = await db.select().from(leads).where(eq(leads.id, Number(id)));

        if (leadExists.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "Lead not found",
                data: null
            });
        }

        const updatedLead = await db.update(leads)
            .set({ status })
            .where(eq(leads.id, Number(id)))
            .returning();

        res.status(200).json({
            status: 200,
            message: "Lead status updated successfully",
            data: updatedLead[0]
        });
    } catch (error) {
        console.error("Error updating lead status:", error);
        res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: null
        });
    }
};

export { getAllLeads, createLead, updateLeadStatus };