USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[GroupMessageUsers_Delete_ByUserId]    Script Date: 9/23/2022 8:46:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Brandon White
-- Create date: 8/12/2022
-- Description: Removes a user from message group.
-- Code Reviewer: Silvio Acevedo

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

ALTER proc [dbo].[GroupMessageUsers_Delete_ByUserId]
									@UserId int
									,@GroupId int

as

/*

Declare @UserId int = 24
		,@GroupId int = 11

Execute dbo.GroupMessageUsers_Delete_ByUserId
									@UserId
									,@GroupId
Select *
from dbo.GroupMessageUsers

*/
Begin

DELETE FROM [dbo].[GroupMessageUsers]
      WHERE dbo.GroupMessageUsers.UserId = @UserId
	  AND dbo.GroupMessageUsers.GroupId = @GroupId

End