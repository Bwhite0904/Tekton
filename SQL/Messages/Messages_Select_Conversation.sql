USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[Messages_Select_Conversation]    Script Date: 9/23/2022 8:42:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Brandon White
-- Create date: 7/30/2022
-- Description: Selects all messages by user Id.
-- Code Reviewer: 

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================


ALTER proc [dbo].[Messages_Select_Conversation]
										@UserId int

as

/*
---------------Test Code-------------------
Declare @UserId int = 8

Execute dbo.Messages_Select_Conversation 
										@UserId
										

Select *
from dbo.Messages

---------------Test Code-------------------
*/

Begin


		SELECT m.Id
			  ,m.Message
			  ,m.Subject
			  ,m.RecipientId
			  ,m.SenderId
			  ,m.DateSent
			  ,m.DateRead
			  ,m.DateModified
			  ,m.DateCreated
			  ,p.FirstName as SenderFirstName
			  ,p.LastName as SenderLastName
			  ,p.AvatarUrl as SenderAvatarUrl
			  ,up.FirstName as RecipientFirstName
			  ,up.LastName as RecipientLastName
			  ,up.AvatarUrl as RecipientAvatarUrl
			  ,TotalCount = COUNT(1) OVER()
		  FROM dbo.Messages AS m
		  inner join dbo.UserProfiles as p on p.UserId = m.SenderId 
		  inner join dbo.UserProfiles as up on up.userId = m.RecipientId
		  WHERE (m.SenderId = @UserId) OR (m.RecipientId = @UserId) 
		  ORDER BY m.Id ASC

End





