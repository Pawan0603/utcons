import AuditLogModel from "@/lib/models/auditLog";

export const createAuditLog = async ({
  userId,
  action,
  articleId,
}: {
  userId: string;
  action: "CREATE_ARTICLE" | "DELETE_ARTICLE" | "PUBLISH_ARTICLE";
  articleId?: string;
}) => {
  try {
     const auditLog = await AuditLogModel.create({
      userId,
      action,
      articleId,
    });

    await auditLog.save();
  } catch (error) {
    console.error("Audit log error:", error);
  }
};