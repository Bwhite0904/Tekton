USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[GroupMessages_Select_ByGroupId]    Script Date: 9/23/2022 8:44:41 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Brandon White
-- Create date: 8/11/2022
-- Description: Selects a group message by Id.
-- Code Reviewer: Silvio Acevedo

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================


ALTER proc [dbo].[GroupMessages_Select_ByGroupId]
										@GroupId int
										,@PageIndex int
										,@PageSize int

as

/*
---------------Test Code-------------------
Declare @GroupId int = 11
		,@PageIndex int = 0
		,@PageSize int = 4

Execute dbo.GroupMessages_Select_ByGroupId 
									@GroupId
									,@PageIndex
									,@PageSize
										
---------------Test Code-------------------
*/

Begin

		Declare @Offset int = @PageIndex * @PageSize
		
		SELECT gm.Id
			  ,gm.Message
			  ,gm.Subject
			  ,gm.GroupId
			  ,gm.SenderId
			  ,gm.DateSent
			  ,gm.DateModified
			  ,gm.DateCreated
			  ,p.Id
			  ,p.UserId
			  ,p.FirstName as SenderFirstName
			  ,p.LastName as SenderLastName
			  ,p.MI
			  ,p.AvatarUrl as SenderAvatarUrl
			  ,TotalCount = COUNT(1) OVER()
		  FROM dbo.GroupMessages AS gm
		  inner join dbo.UserProfiles as p on p.UserId = gm.SenderId
		  WHERE (gm.GroupId = @GroupId)
		  ORDER BY gm.Id

		  OFFSET @Offset Rows
		  FETCH NEXT @PageSize Rows ONLY

		  

End

