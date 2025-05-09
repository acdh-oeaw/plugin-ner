import { createServerSDK } from "@recogito/studio-sdk";
export const GET = async ({ request, params, cookies }) => {
    const projectId = params.projectId;
    const documentId = params.documentId;
    // @ts-ignore
    const sdk = await createServerSDK(request, cookies, import.meta.env);
    const { error: profileError, data: profile } = await sdk.profile.getMyProfile();
    if (profileError || !profile)
        return new Response(JSON.stringify({ message: "Not authorized" }));
    const hasSelectPermissions = await sdk.project.hasSelectPermissions(profile, projectId);
    if (!hasSelectPermissions)
        return new Response(JSON.stringify({ message: "Not authorized" }));
    return new Response(JSON.stringify({ message: "Success!" }), {
        status: 200,
    });
};
