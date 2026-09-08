import db from './db.js';

const getAllProjects = async () => {
    const query = `
        SELECT 
            p.project_id, 
            p.title, 
            p.description, 
            p.location, 
            p.date, 
            o.name AS organization_name
        FROM public.service_project p
        JOIN public.organization o ON p.organization_id = o.organization_id
        ORDER BY p.date ASC;
    `;
    const result = await db.query(query);
    return result.rows;
};

const getProjectById = async (projectId) => {
    const query = `
        SELECT 
            p.project_id, 
            p.title, 
            p.description, 
            p.location, 
            p.date, 
            o.name AS organization_name,
            o.contact_email
        FROM public.service_project p
        JOIN public.organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows[0];
};

export { getAllProjects, getProjectById };
