USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[MessageGroups_Select_ById]    Script Date: 9/23/2022 8:46:56 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Brandon White
-- Create date: 8/12/2022
-- Description: Selects a message group by id.
-- Code Reviewer: Silvio Acevedo

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

ALTER proc [dbo].[MessageGroups_Select_ById]
									@Id int

as

/*

Declare @Id int = 11


Execute dbo.MessageGroups_Select_ById
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
  FROM dbo.MessageGroups as mg
  WHERE mg.Id = @Id

End