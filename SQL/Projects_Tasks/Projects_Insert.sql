USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[Projects_Insert]    Script Date: 9/23/2022 8:50:54 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Brandon White
-- Create date: 9/20/2022
-- Description: This proc inserts necessary data for dbo.Projects
-- Code Reviewer:

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note: 
-- =============================================

ALTER PROC [dbo].[Projects_Insert]
							@LocationId int,
							@OrgId int,
							@Name nvarchar(200),
							@EstimatedStartDate datetime2(7),
							@Description nvarchar(4000),
							@ProjectId int OUTPUT

as

/*
-----------------------------Test Code ----------------------------------
DECLARE
		@LocationId int = 21,
		@OrgId int = 1,
		@Name nvarchar(200) = 'Downtown LA Metro Maintenance Facility',
		@EstimatedStartDate datetime2(7) = '2023-01-01',
		@Description nvarchar(4000) = 'Complete remodel of the Downtown LA Metro maintenance facility and parking structure.',
		@ProjectId int

EXECUTE dbo.Projects_Insert
							@LocationId,
							@OrgId,
							@Name,
							@EstimatedStartDate,
							@Description,
							@ProjectId

Select * from dbo.Projects

-----------------------------Test Code ----------------------------------
*/

Begin

			DECLARE @DateCreated datetime2(7) = GETUTCDATE()

			INSERT INTO [dbo].[Projects]
					   ([OrganizationId]
					   ,[Name]
					   ,[DateCreated]
					   ,[DateModified]
					   ,[EstimatedStartDate]
					   ,[Description]
					   ,[LocationId])
				 VALUES
					   (@OrgId,
					   @Name,
					   @DateCreated,
					   @DateCreated,
					   @EstimatedStartDate,
					   @Description,
					   @LocationId)

			SET		@ProjectId = SCOPE_IDENTITY()

END