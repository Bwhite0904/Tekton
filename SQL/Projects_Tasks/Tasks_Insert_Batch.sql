USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[Tasks_Insert_Batch]    Script Date: 9/23/2022 8:51:26 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Brandon White
-- Create date: 9/20/2022
-- Description: This proc inserts batch data for dbo.Tasks
-- Code Reviewer:

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note: 
-- =============================================
ALTER PROC [dbo].[Tasks_Insert_Batch]
							@Tasks dbo.BatchTasksV1 READONLY
AS

/*

Declare @Tasks dbo.BatchTasksV1

Insert INTO @Tasks (ProjectId,
					TaskTypeId,
					Name,
					Description,
					ContactName,
					ContactPhone,
					ContactEmail,
					EstimatedStartDate,
					EstimatedFinishDate,
					CreatedBy,
					ModifiedBy,
					ParentTaskId,
					AwardedOrgId,
					IsDeleted)
		VALUES (1,
				5,
				'Electrical',
				'Lighting for parking structure',
				'John',
				'(555)555-5555',
				'john@tekton.com',
				'2023-01-01',
				null,
				92,
				null,
				null,
				null,
				0),(1,
				5,
				'Plumbing',
				'Plumbing for maintenance Facility',
				'John',
				'(555)555-5555',
				'john@tekton.com',
				'2023-01-01',
				null,
				92,
				null,
				null,
				null,
				0)

EXECUTE dbo.Tasks_InsertBatch
					@Tasks

Select *
from dbo.Tasks

*/
BEGIN

DECLARE @DateCreated datetime2(7) = GETUTCDATE()

INSERT INTO [dbo].[Tasks]
           ([ProjectId]
           ,[TaskTypeId]
           ,[Name]
           ,[Decsription]
           ,[ContactName]
           ,[ContactPhone]
           ,[ContactEmail]
           ,[EstimatedStartDate]
           ,[EstimatedFinishDate]
           ,[CreatedBy]
           ,[ModifiedBy]
           ,[ParentTaskId]
           ,[AwardedOrgId]
           ,[IsDeleted]
           ,[DateCreated])

     SELECT t.ProjectId,
			t.TaskTypeId,
			t.Name,
			t.Description,
			t.ContactName,
			t.ContactPhone,
			t.ContactEmail,
			t.EstimatedStartDate,
			t.EstimatedFinishDate,
			t.CreatedBy,
			t.ModifiedBy,
			t.ParentTaskId,
			t.AwardedOrgId,
			t.IsDeleted,
			@DateCreated
	 from @Tasks as t

END