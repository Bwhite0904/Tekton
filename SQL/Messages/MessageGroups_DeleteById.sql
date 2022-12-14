USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[MessageGroups_DeleteById]    Script Date: 9/23/2022 8:48:31 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Brandon White
-- Create date: 8/12/2022
-- Description: Deletes a message group, all
-- associated messages and associated users.
-- Code Reviewer: Silvio Acevedo

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

ALTER proc [dbo].[MessageGroups_DeleteById]
								@Id int
as

/*

Select *
from dbo.MessageGroups

Declare @Id int = 13

Execute dbo.MessageGroups_DeleteById
								@Id

Select *
from dbo.MessageGroups

Select *
from dbo.GroupMessageUsers
*/

Begin

DELETE FROM dbo.GroupMessageUsers
	  WHERE dbo.GroupMessageUsers.GroupId = @Id

DELETE FROM dbo.GroupMessages
	  WHERE dbo.GroupMessages.GroupId = @Id

DELETE FROM [dbo].[MessageGroups]
      WHERE dbo.MessageGroups.Id = @Id

End