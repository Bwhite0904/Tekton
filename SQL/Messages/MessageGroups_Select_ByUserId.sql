USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[MessageGroups_Select_ByUserId]    Script Date: 9/23/2022 8:48:07 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Brandon White
-- Create date: 8/13/2022
-- Description: Selects message groups by userId.
-- Code Reviewer: Silvio Acevedo

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

ALTER proc [dbo].[MessageGroups_Select_ByUserId]
									@Id int

as

/*

Declare @Id int = 8


Execute dbo.MessageGroups_Select_ByUserId
								@Id

*/

Begin

SELECT mg.Id
      ,mg.DateCreated
      ,mg.DateModified
      ,mg.Name
      ,mg.CreatedById
	  ,Users = (Select up.Id
						,up.FirstName
						,up.LastName
						,up.MI
						,up.AvatarUrl
						,up.UserId
				From dbo.UserProfiles as up inner join dbo.GroupMessageUsers as gmu
				on gmu.UserId = up.UserId
				WHERE gmu.GroupId = mg.Id
				FOR JSON AUTO)
  FROM dbo.MessageGroups as mg inner join dbo.GroupMessageUsers as gmu
  ON gmu.GroupId = mg.Id
  WHERE gmu.UserId = @Id

End