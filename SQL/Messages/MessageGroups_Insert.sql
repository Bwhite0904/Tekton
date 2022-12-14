USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[MessageGroups_Insert]    Script Date: 9/23/2022 8:46:30 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Brandon White
-- Create date: 8/12/2022
-- Description: Creates a message group.
-- Code Reviewer: Silvio Acevedo

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

ALTER proc [dbo].[MessageGroups_Insert]
								@Name nvarchar(50)
								,@CreatedById int
								,@Id int OUTPUT

as

/*

Declare @Id int
		,@Name nvarchar(50) = 'Tekton'
		,@CreatedById int = 24

Execute dbo.MessageGroups_Insert
							@Name
							,@CreatedById
							,@Id

Select *
from dbo.MessageGroups

Select *
from dbo.GroupMessageUsers

*/

Begin

		Declare @DateCreated datetime2(7) = GETUTCDATE()

		INSERT INTO [dbo].[MessageGroups]
				   ([DateCreated]
				   ,[Name]
				   ,[CreatedById])


			 SELECT
				   @DateCreated
				   ,@Name
				   ,@CreatedById

		SET		    @Id = SCOPE_IDENTITY()

		INSERT INTO dbo.GroupMessageUsers
					([DateAdded]
					,[AddedById]
					,[GroupId]
					,[UserId])

			 SELECT
					@DateCreated
					,@CreatedById
					,@Id
					,@CreatedById

End
