USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[GroupMessageUsers_Insert]    Script Date: 9/23/2022 8:45:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Brandon White
-- Create date: 8/12/2022
-- Description: Adds a user to a group.
-- Code Reviewer: Silvio Acevedo

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================


ALTER proc [dbo].[GroupMessageUsers_Insert]
									@AddedById int
									,@GroupId int
									,@UserId int
									,@Id int OUTPUT

as

/*

Declare @Id int
		,@AddedById int = 8
		,@GroupId int = 11
		,@UserId int = 24


Execute dbo.GroupMessageUsers_Insert
									@AddedById
									,@GroupId
									,@UserId
									,@Id
Select *
from dbo.GroupMessageUsers
*/
Begin

Declare @DateAdded datetime2(7) = GETUTCDATE()

INSERT INTO [dbo].[GroupMessageUsers]
           ([DateAdded]
           ,[AddedById]
           ,[GroupId]
           ,[UserId])
     SELECT
           @DateAdded
           ,@AddedById
           ,@GroupId
           ,@UserId
	WHERE NOT EXISTS (Select 1
						FROM dbo.GroupMessageUsers as gu
						WHERE gu.Id = @UserId)


End